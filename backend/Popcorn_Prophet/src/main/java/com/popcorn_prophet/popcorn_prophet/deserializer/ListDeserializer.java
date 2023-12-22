package com.popcorn_prophet.popcorn_prophet.deserializer;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ListDeserializer extends StdDeserializer<List<String>> {
    protected ListDeserializer(Class<?> vc) {
        super(vc);
    }
    public ListDeserializer() {
        this(null);
    }

    @Override
    public List<String> deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JacksonException {
        JsonNode node = jsonParser.getCodec().readTree(jsonParser);



        if (node != null ) {
            String listString = node.asText();
            List<String> list = new ArrayList<>(Arrays.asList(listString.split(", ")));
            return list;
        }


        return null;
    }
}
