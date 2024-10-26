import axios from "axios";
import { connect, StringCodec } from "nats";

import { getSignedUrlFromS3 } from '../aws/s3';

const SC = StringCodec();

export const handler = async (event, context) => {
    try {
        console.log('event', JSON.stringify(event, null, 2));
        try {
            let caFile = '/opt/triton-dev-ca.crt';
            if (process.env.LAMBDA_NODE_ENV === 'production') {
                caFile = '/opt/triton-prod-ca.crt';
            }
            const nc = await connect({
                servers: [process.env.TRITON_NATS_URL],
                user: process.env.TRITON_NATS_ADMIN_USER, pass: process.env.TRITON_NATS_ADMIN_PASSWORD,
                tls: {
                    caFile: caFile,
                }
            });
            if (event.body && event.body.message_uuid) {
                if (['image', 'text', 'audio', 'contacts', 'location'].includes(event.body.content_type)) {
                    const toPub = {
                        sender_phone: event.body.sender,
                        sender_name: event.body.customer_name,
                        message_uuid: event.body.message_uuid,
                        received_at: event.body.received_at,
                        text: event.body.text,
                        content_type: event.body.content_type,
                        url: event.body.url,
                        contacts: event.body.contacts,
                    }
                    if ('location' === event.body.content_type) {
                        toPub.map_link = `https://www.google.com/maps?q=${event.body.latitude},${event.body.longitude}`
                    }
                    console.log('PUBLISHING', JSON.stringify(toPub))
                    nc.publish(`chat.mumbaihacks.a.whatsapp.messages`, SC.encode(JSON.stringify(toPub)));
                }
            }
        } catch (natsError) {
            console.log('nats error', natsError);
        }
        return { code: 200, data: { message: 'Message sent successfully' } };
    } catch (error) {
        console.log('error', error);
        return { code: 500, data: { message: error.message || 'Internal Server Error' } }
    }
}