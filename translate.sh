#!/bin/bash

LOCALES_FOLDER=app/public/locales
MISSING_FILE="$LOCALES_FOLDER/missing.txt"
MODULES=(google bing)

while IFS= read -r name; do 
    if [ -f "$LOCALES_FOLDER/$name/translation.json" ]; then
        continue
    fi

    for mod in "${MODULES[@]}"; do
        node_modules/@parvineyvazov/json-translator/bin/jsontt "$LOCALES_FOLDER/en/translation.json" --module $mod --from en --to $name --name translation -cl 1 -fb yes
        if [ $? -eq 0 ]; then
            mkdir -p "$LOCALES_FOLDER/$name"
            mv "$LOCALES_FOLDER/en/translation.$name.json" "$LOCALES_FOLDER/$name/translation.json"
            break;
        fi
    done

    if [ ! -f "$LOCALES_FOLDER/$name/translation.json" ]; then
        touch $MISSING_FILE
        grep -qxF $name $MISSING_FILE || echo $name >> $MISSING_FILE
    fi
done <"$LOCALES_FOLDER/locales.txt"