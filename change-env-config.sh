#!/bin/bash

FILE=$1

for ENV_VAR in $(printenv | grep '^REACT_APP_' | awk -F= '{print $1}'); do
    KEY=$ENV_VAR
    NEW_VALUE=$(printenv "$ENV_VAR")

    sed -i "s|\"$KEY\": *\"[^\"]*\"|\"$KEY\": \"$NEW_VALUE\"|" "$FILE"

    echo "Updated $KEY to $NEW_VALUE in $FILE"
done