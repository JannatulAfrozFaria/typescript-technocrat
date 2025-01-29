// DropDown Props Type
type DropDownProps = {
    name: string;
    label: string;
    control: any;
    disabled?: boolean;
    children: React.ReactNode;
  };
  
  // DropDown Component
  const DropDown: React.FC<DropDownProps> = ({
    name,
    label,
    control,
    disabled,
    children,
  }) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }: { field: any }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <select
                {...field}
                className="w-full px-3 py-2 border rounded-md"
                disabled={disabled}
              >
                {children}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };
  
  type DropDownSection = {
      title?: string; // Optional title
      options: { value: string; label: string }[]; 
  };