import { Flex, TextInput, Select } from "@mantine/core";
import { countries } from "../../../util/countries";
function SecondStep() {
  return (
    <form>
      <Flex gap={15} direction={"column"}>
        <TextInput label="First name" placeholder="Your First name" />
        <TextInput label="Last name" placeholder="Your Last name" />
        <TextInput label="Recipient email" placeholder="Recipient email" />
        <TextInput label="Postal code" placeholder="Your Postal code" />
        <TextInput label="Town/City" placeholder="Your Postal code" />
        <TextInput label="Address" placeholder="Your Address" />
        <Select label="Country" data={countries} placeholder="Your Country" />
      </Flex>
    </form>
  );
}

export default SecondStep;
