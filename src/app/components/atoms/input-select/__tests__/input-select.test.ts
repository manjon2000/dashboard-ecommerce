import { render, screen, fireEvent } from '@testing-library/angular';
import { default as userEvent } from '@testing-library/user-event';
import * as matchers from '@testing-library/jest-dom/matchers';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputSelect } from '../input-select';
import * as consts from '../consts/consts';

expect.extend(matchers);

const setup = async (props: { 
  value?: string; 
  placeholder?: string; 
  disabled?: boolean; 
  options?: any[] 
} = {}) => {
  const utils = await render(InputSelect, {
    componentInputs: {
      value: props.value ?? consts.VALUE_EMPTY,
      placeholder: props.placeholder ?? consts.PLACEHOLDER_DEFAULT,
      disabled: props.disabled ?? consts.BOOLEAN_FALSE,
      options: props.options ?? consts.SELECT_OPTIONS_MOCK
    },
    imports: [FormsModule, ReactiveFormsModule]
  });
  
  const select = screen.getByRole(consts.DOM_ROLE_SELECT) as HTMLSelectElement;
  
  return { ...utils, select };
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('InputSelect: DOM rendering', () => {
  it('Should render the component with correct number of options including placeholder', async () => {
    const { select } = await setup({ placeholder: consts.PLACEHOLDER_CUSTOM });
    expect(select).toBeInTheDocument();
    
    // Usamos { hidden: true } para que Testing Library cuente la opción del placeholder que tiene el atributo 'hidden'
    const options = screen.getAllByRole(consts.DOM_ROLE_OPTION, { hidden: true });
    expect(options.length).toBe(consts.SELECT_OPTIONS_MOCK.length + 1); 
  });

  it('Should show the correct placeholder text', async () => {
    await setup({ placeholder: consts.PLACEHOLDER_CUSTOM });
    const placeholderOption = screen.getByText(consts.PLACEHOLDER_CUSTOM);
    expect(placeholderOption).toBeInTheDocument();
  });
});

describe('InputSelect: Reactive Interactions', () => {
  it('Should update the signal and call onChange when user selects an option', async () => {
    const user = userEvent.setup();
    const { select, fixture } = await setup();
    const component = fixture.componentInstance;
    
    const onChangeSpy = vi.fn();
    component.registerOnChange(onChangeSpy);

    await user.selectOptions(select, consts.VALUE_NEW);
    
    expect(select.value).toBe(consts.VALUE_NEW);
    expect(component.valueSignal()).toBe(consts.VALUE_NEW);
    expect(onChangeSpy).toHaveBeenCalledWith(consts.VALUE_NEW);
  });

  it('Should handle blur and focus states and notify stateChanges', async () => {
    const { select, fixture } = await setup();
    const component = fixture.componentInstance;
    const stateSpy = vi.spyOn(component.stateChanges, 'next');

    await fireEvent.focus(select);
    expect(component.focusedSignal()).toBe(consts.BOOLEAN_TRUE);
    expect(stateSpy).toHaveBeenCalled();

    await fireEvent.blur(select);
    expect(component.focusedSignal()).toBe(consts.BOOLEAN_FALSE);
  });
});

describe('InputSelect: State Disabled', () => {
  it('Should be disabled when the signal is true', async () => {
    const { select } = await setup({ disabled: consts.BOOLEAN_TRUE });
    expect(select).toBeDisabled();
  });

  it('Should update disabled state via setDisabledState', async () => {
    const { select, fixture } = await setup();
    fixture.componentInstance.setDisabledState(consts.BOOLEAN_TRUE);
    fixture.detectChanges();
    expect(select).toBeDisabled();
  });
});

describe('InputSelect: Form Integration (CVA)', () => {
  it('Should reflect value changes from writeValue into the DOM', async () => {
    const { select, fixture } = await setup({ value: consts.VALUE_INITIAL });
    const component = fixture.componentInstance;

    component.writeValue(consts.VALUE_NEW);
    fixture.detectChanges();

    expect(select.value).toBe(consts.VALUE_NEW);
  });
});

describe('InputSelect: Material Integration', () => {
  it('Should focus the select element when onContainerClick is triggered', async () => {
    const { select, fixture } = await setup();
    const spy = vi.spyOn(select, 'focus');
    
    fixture.componentInstance.onContainerClick();
    
    expect(spy).toHaveBeenCalled();
  });

  it('Should report empty state correctly for Material Form Field', async () => {
    const { fixture } = await setup({ value: consts.VALUE_EMPTY });
    expect(fixture.componentInstance.empty).toBe(consts.BOOLEAN_TRUE);

    fixture.componentInstance.valueSignal.set(consts.VALUE_NEW);
    expect(fixture.componentInstance.empty).toBe(consts.BOOLEAN_FALSE);
  });
});