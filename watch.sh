#!/bin/sh -v

# https://superuser.com/questions/181517/how-to-execute-a-command-whenever-a-file-changes/181543#181543

while inotifywait -e close_write resume.hjson
do
    ./generate.sh
done
