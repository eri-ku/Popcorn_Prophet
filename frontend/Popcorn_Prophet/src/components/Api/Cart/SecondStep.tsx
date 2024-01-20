import { Flex, TextInput, Select } from "@mantine/core";
import { countries } from "../../../util/countries";
function SecondStep({ form }: { form: any }) {
  return (
    <Flex gap={15} direction={"column"}>
      <TextInput
        label="First name"
        placeholder="Your First name"
        required
        {...form.getInputProps("firstName")}
      />
      <TextInput
        label="Last name"
        placeholder="Your Last name"
        required
        {...form.getInputProps("lastName")}
      />
      <TextInput
        label="Recipient email"
        placeholder="Recipient email"
        required
        {...form.getInputProps("email")}
      />
      <TextInput
        label="Postal code"
        placeholder="Your Postal code"
        required
        {...form.getInputProps("postalCode")}
      />
      <TextInput
        label="Town/City"
        placeholder="Your Town/City code"
        required
        {...form.getInputProps("city")}
      />
      <TextInput
        label="Address"
        placeholder="Your Address"
        required
        {...form.getInputProps("address")}
      />
      <Select
        label="Country"
        data={countries}
        required
        placeholder="Your Country"
        {...form.getInputProps("country")}
      />
    </Flex>
  );
}

export default SecondStep;
