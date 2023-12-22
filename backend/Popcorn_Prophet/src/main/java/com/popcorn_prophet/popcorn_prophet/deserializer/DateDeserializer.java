package com.popcorn_prophet.popcorn_prophet.deserializer;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Locale;

public class DateDeserializer extends StdDeserializer<Date> {
    protected DateDeserializer(Class<?> vc) {
        super(vc);
    }
    public DateDeserializer() {
        this(null);
    }

    @Override
    public Date deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JacksonException {
        JsonNode node = jsonParser.getCodec().readTree(jsonParser);



        if (node != null) {
            String listString = node.asText();


            try {
                return new Date(new SimpleDateFormat("yyyy-MMM-dd").parse(listString).getTime());
            } catch (ParseException e) {
                try {
                    return new Date(new SimpleDateFormat("dd MMM yyyy", Locale.ENGLISH).parse(listString).getTime());
                } catch (ParseException parseException) {
                    parseException.printStackTrace();
                }
            }
        }


        return null;
    }
}
