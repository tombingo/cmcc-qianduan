interface FormItemProps {
  higherDeptOptions: Record<string, unknown>[];
  parentDept: number;
  deptName: string;
  weight: number;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
