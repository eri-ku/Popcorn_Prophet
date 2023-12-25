import { Flex, TextInput, Select, Button } from "@mantine/core";
import { countries } from "../../../util/countries";
import { useForm } from "@mantine/form";
import { set } from "date-fns";
function SecondStep({ form }: { form: any }) {
  return (
    <Flex gap={15} direction={"column"}>
      <TextInput
        label="First name"
        placeholder="Your First name"
        {...form.getInputProps("firstName")}
      />
      <TextInput
        label="Last name"
        placeholder="Your Last name"
        {...form.getInputProps("lastName")}
      />
      <TextInput
        label="Recipient email"
        placeholder="Recipient email"
        {...form.getInputProps("email")}
      />
      <TextInput
        label="Postal code"
        placeholder="Your Postal code"
        {...form.getInputProps("postalCode")}
      />
      <TextInput
        label="Town/City"
        placeholder="Your Town/City code"
        {...form.getInputProps("city")}
      />
      <TextInput
        label="Address"
        placeholder="Your Address"
        {...form.getInputProps("address")}
      />
      <Select
        label="Country"
        data={countries}
        placeholder="Your Country"
        {...form.getInputProps("country")}
      />
    </Flex>
  );
}

export default SecondStep;
