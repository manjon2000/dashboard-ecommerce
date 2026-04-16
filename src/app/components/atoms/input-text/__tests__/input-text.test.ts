import { render, screen, fireEvent } from '@testing-library/angular';
import { default as userEvent } from '@testing-library/user-event';
import * as matchers from '@testing-library/jest-dom/matchers';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputText } from '../input-text';
import * as consts from '../consts/consts';

expect.extend(matchers);

const setup = async (props: { value?: string; placeholder?: string; disabled?: boolean } = {}) => {
  const utils = await render(InputText, {
    componentInputs: {
      value: props.value ?? consts.INPUT_TEXT_MOCKS.DEFAULT_VALUE,
      placeholder: props.placeholder ?? consts.INPUT_TEXT_MOCKS.DEFAULT_PLACEHOLDER,
      disabled: props.disabled ?? consts.INPUT_TEXT_STATES.ENABLED
    },
    imports: [FormsModule, ReactiveFormsModule]
  });

  const input = screen.getByPlaceholderText(
    props.placeholder ?? consts.INPUT_TEXT_MOCKS.DEFAULT_PLACEHOLDER
  ) as HTMLInputElement;

  return { ...utils, input };
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('InputText: DOM rendering', () => {
  it('Should render the component with initial value signal', async () => {
    const { input } = await setup({ 
      value: consts.INPUT_TEXT_MOCKS.TEST_VALUE, 
      placeholder: consts.INPUT_TEXT_MOCKS.TEST_NAME_PLACEHOLDER 
    });
    expect(input).toBeInTheDocument();
    expect(input.value).toBe(consts.INPUT_TEXT_MOCKS.TEST_VALUE);
  });

  it('Should show the correct placeholder', async () => {
    const placeholderText = consts.INPUT_TEXT_MOCKS.TEST_SEARCH_PLACEHOLDER;
    const { input } = await setup({ placeholder: placeholderText });
    expect(input.placeholder).toBe(placeholderText);
  });
});

describe('InputText: Reactive Interactions', () => {
  it('Should update the signal and call onChange when user types', async () => {
    const user = userEvent.setup();
    const { input, fixture } = await setup();
    const component = fixture.componentInstance;

    const onChangeSpy = vi.fn();
    component.registerOnChange(onChangeSpy);

    await user.type(input, consts.INPUT_TEXT_MOCKS.TYPED_CONTENT);

    expect(input.value).toBe(consts.INPUT_TEXT_MOCKS.TYPED_CONTENT);
    expect(component.valueSignal()).toBe(consts.INPUT_TEXT_MOCKS.TYPED_CONTENT);
    expect(onChangeSpy).toHaveBeenCalledWith(consts.INPUT_TEXT_MOCKS.TYPED_CONTENT);
  });

  it('Should handle blur and focus states for Material float label', async () => {
    const { input, fixture } = await setup();
    const component = fixture.componentInstance;
    const stateSpy = vi.spyOn(component.stateChanges, 'next');

    await fireEvent.focus(input);
    expect(component.focusedSignal()).toBe(consts.INPUT_TEXT_STATES.FOCUSED);
    expect(stateSpy).toHaveBeenCalled();

    await fireEvent.blur(input);
    expect(component.focusedSignal()).toBe(consts.INPUT_TEXT_STATES.BLURRED);
    expect(component.touchedSignal()).toBe(false);
  });
});

describe('InputText: State Disabled', () => {
  it('Should disable the native input when signal is true', async () => {
    const { input } = await setup({ disabled: consts.INPUT_TEXT_STATES.DISABLED });
    expect(input).toBeDisabled();
  });

  it('Should update via setDisabledState (CVA)', async () => {
    const { input, fixture } = await setup();
    fixture.componentInstance.setDisabledState(consts.INPUT_TEXT_STATES.DISABLED);
    fixture.detectChanges();
    expect(input).toBeDisabled();
  });
});

describe('InputText: Form Integration (CVA)', () => {
  it('Should work with Reactive Forms control', async () => {
    const { input, fixture } = await setup({ value: consts.INPUT_TEXT_MOCKS.FORM_INITIAL_VALUE });
    const component = fixture.componentInstance;

    component.writeValue(consts.INPUT_TEXT_MOCKS.FORM_NEW_VALUE);
    fixture.detectChanges();

    expect(input.value).toBe(consts.INPUT_TEXT_MOCKS.FORM_NEW_VALUE);
  });
});

describe('InputText: Material Integration', () => {
  it('Should focus the input when onContainerClick is called', async () => {
    const { input, fixture } = await setup();
    const spy = vi.spyOn(input, 'focus');

    fixture.componentInstance.onContainerClick();

    expect(spy).toHaveBeenCalled();
  });

  it('Should correctly report empty state for Material', async () => {
    const { fixture } = await setup({ value: consts.INPUT_TEXT_MOCKS.DEFAULT_VALUE });
    expect(fixture.componentInstance.empty).toBe(consts.INPUT_TEXT_STATES.EMPTY);

    fixture.componentInstance.valueSignal.set(consts.INPUT_TEXT_MOCKS.SIGNAL_UPDATE_VALUE);
    expect(fixture.componentInstance.empty).toBe(consts.INPUT_TEXT_STATES.NOT_EMPTY);
  });
});