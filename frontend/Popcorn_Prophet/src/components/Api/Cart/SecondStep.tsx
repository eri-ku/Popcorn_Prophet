import { Fieldset, TextInput } from "@mantine/core";
function SecondStep() {
  return (
    <Fieldset legend="Personal information" variant="unstyled">
      <TextInput label="Your name" placeholder="Your name" />
      <TextInput label="Email" placeholder="Email" mt="md" />
    </Fieldset>
  );
}

export default SecondStep;
