import React, { ForwardedRef, ReactNode } from 'react';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import 'tailwindcss/tailwind.css';

interface SelectItemProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  value: string;
}

const SelectItem = React.forwardRef(({ children, className, ...props }: SelectItemProps, forwardedRef: ForwardedRef<HTMLDivElement>) => {
  return (
    <Select.Item 
      className={`px-10 py-1 relative flex items-center text-black ${className}`} 
      {...props} 
      ref={forwardedRef}
      data-disabled={props.disabled ? 'true' : undefined}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 w-6 flex items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

export interface SelectItem{
  value: string;
  display: string;
  disabled?: boolean;
}

interface SelectGroup {
  label: string;
  items: SelectItem[];
}

interface SelectBarProps {
  groups: SelectGroup[];
  placeholder?: string;
  defaulSelected: SelectItem;
  onValueChange: (value: string) => void;
}

const SelectBar: React.FC<SelectBarProps> = ({ groups,placeholder,onValueChange,defaulSelected}) => (
  <Select.Root 
    onValueChange={onValueChange}
    defaultValue={defaulSelected.value}
  >
    <Select.Trigger 
      className="inline-flex items-center justify-center mb-5 text-sm px-4 h-9 bg-white text-gray-700 shadow-sm
       hover:bg-gray-200 focus:ring-2 focus:ring-black gap-1.5 rounded-md"
      aria-label="Food"
    >
      <Select.Value placeholder={placeholder|| "Select"}/>
      <Select.Icon className="text-black">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="overflow-hidden bg-white rounded shadow-lg">
        <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-black cursor-default">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="p-1">
          {groups.map((group, index) => (
            <React.Fragment key={index}>
              <Select.Group>
                <Select.Label className="px-6 text-xs leading-6 text-gray-800">{group.label}</Select.Label>
                {group.items.map(item => (
                  <SelectItem key={item.value} value={item.value} disabled={item.disabled} >
                    {item.display}
                  </SelectItem>
                ))}
              </Select.Group>
              {index >0 && <Select.Separator className="h-px bg-purple-500 my-1" />}
            </React.Fragment>
          ))}
        </Select.Viewport>
        <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-black cursor-default">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

export default SelectBar;
