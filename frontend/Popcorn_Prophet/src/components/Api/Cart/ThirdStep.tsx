import { Select } from "@mantine/core";
function ThirdStep({ form }: { form: any }) {
  return (
    <Select
      label={"Select your paymend method:"}
      data={["Visa", "Paypal", "MasterCard", "Bank Transfer"]}
      {...form.getInputProps("paymentMethod")}
    ></Select>
  );
}

export default ThirdStep;
