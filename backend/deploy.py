"""
This program deploys the serverless projects you specify. It takes the names of the folders
as command line arguments. If no argument is provided it, it deploys all the projects it finds.
The stage (--stage) and region (--region) are optional flags that can be used to specify the stage and region of deployment.
The default stage is "dev" and default region is "ap-south-1".
The exclude (--exclude) flag can be used to specify the folders that should not be considered for deployment.
If the exclude flag is used, all folders EXCEPT THE SPECIFIED ONES UNDER THE EXCLUDE FLAG are deployed,
the stage and region flags work normally even the exclude flag is provided.

Example usage:
If you want to deploy all projects in a folder
$ python deploy.py
If you want to deploy the folder - "proj1", "proj2", "proj3" at stage "dev" and region "us-east-1"
$ python deploy.py proj1 proj2 proj3 --stage dev --region us-east-1
If you want deploy all folders but want to exclude the folders - "exproj1", "exproj2" at stage "prod" and region "ap-south-1"
$ python deploy.py --exclude exproj1 exproj2 --stage prod
"""
import sys
import os

dir_path = os.path.dirname(os.path.realpath(__file__))
stage, region = 'dev', 'ap-south-1'
include = []
exclude = []
toIgnore = ['node_modules', '.git']

if len(sys.argv) > 1:
    if '--stage' in sys.argv:
        stageIdx = sys.argv.index('--stage')
        stage = sys.argv[stageIdx + 1]
        sys.argv.remove('--stage')
        sys.argv.remove(stage)
    if '--region' in sys.argv:
        regionIdx = sys.argv.index('--region')
        region = sys.argv[regionIdx + 1]
        sys.argv.remove('--region')
        sys.argv.remove(region)
    if '--exclude' in sys.argv:
        e_index = sys.argv.index('--exclude')
        exclude.extend(sys.argv[e_index + 1:])
    else:
        include.extend(sys.argv[1:])


def deploy(folder):
    bashCommand = 'bash deploy.sh "{}" {} {}'.format(folder, stage, region)
    os.system(bashCommand)


def isSlsProject(folder):
    return 'serverless.yml' in os.listdir(os.path.realpath(folder))


def deployInFolder(folder):

    allDirs = [f for f in os.listdir(
        folder) if os.path.isdir(f) and f not in toIgnore]
    print('All folders in {}: {}'.format(folder, allDirs))
    slsProjs = list(filter(isSlsProject, allDirs))
    print('All sls projects in {}: {}'.format(folder, slsProjs))
    notSlsProjs = set(allDirs).difference(slsProjs)
    print('All other folders in {}: {}'.format(folder, notSlsProjs))

    # deploy all the sls projects
    if len(exclude) > 0:
        toDeploy = set(slsProjs).difference(exclude)
    elif len(include) > 0:
        toDeploy = set(slsProjs).intersection(include)
    else:
        toDeploy = set(slsProjs)
    print('The ones to deploy in {}: {}'.format(folder, toDeploy))
    for dep in toDeploy:
        deploy(os.path.realpath(dep))
    # got into all folder which aren't sls projects and deploy the sls projects inside them
    for f in notSlsProjs:
        goingIn = os.path.realpath(f)
        os.chdir(goingIn)
        print('went inside {}'.format(goingIn))
        deployInFolder(os.path.realpath(goingIn))
        os.chdir('..')


def main():
    print('Folders to exclude: {}'.format(exclude))
    print('Folder to include: {}'.format(include))
    deployInFolder(dir_path)


if __name__ == '__main__':
    main()
