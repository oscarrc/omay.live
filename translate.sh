LOCALES_FOLDER=./app/public/locales
MISSING_FILE="$LOCALES_FOLDER/missing.txt"

while IFS= read -r name; do 
    if [ -f "$LOCALES_FOLDER/$name/translation.json" ]; then
        continue
    fi
    
    jsontt "$LOCALES_FOLDER/en/translation.json" --module google --from en --to $name --name translation -cl 1 -fb yes &&
    mkdir -p "$LOCALES_FOLDER/$name" &&
    mv "$LOCALES_FOLDER/en/translation.$name.json" "$LOCALES_FOLDER/$name/translation.json" ||
    touch $MISSING_FILE $name >> $MISSING_FILE

done <"$LOCALES_FOLDER/locales.txt"