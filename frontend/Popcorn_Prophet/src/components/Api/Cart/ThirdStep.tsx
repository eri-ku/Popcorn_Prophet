import { Select } from "@mantine/core";
function ThirdStep() {
  return (
    <Select
      label={"Select your paymend method:"}
      data={["Visa", "Paypal", "MasterCard", "Bank Transfer"]}
    ></Select>
  );
}

export default ThirdStep;
