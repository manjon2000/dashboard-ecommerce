import { fireEvent, render, screen } from '@testing-library/angular';
import { default as userEvent } from '@testing-library/user-event';
import * as matchers from '@testing-library/jest-dom/matchers';
import { describe, it, expect } from 'vitest';
import { ButtonComponent } from '../button';
import { TButtonTypes } from '../models/button';
import { Appearance } from '../directives/appearance';
import * as consts from '../consts/consts-test';

expect.extend(matchers);

const setup = async (
    type: TButtonTypes = consts.VARIATION_FILLED, 
    label: string = consts.LABEL_TEXT, 
    isDisabled: boolean = consts.BOOLEAN_FALSE,
    onClickSpy?: () => void,
) => {
    const utils = await render(ButtonComponent, {inputs: {type, label, isDisabled}, imports: [Appearance], on: {[consts.EVENTS.CLICK]: onClickSpy} } );
    const btn = screen.getByRole(consts.DOM_ROLE);

    return { ...utils, btn };
};

afterEach(() => {
    vi.restoreAllMocks();
});

describe('Testing dom integrated.', () => {
    it('Should showed component in DOM', async () => {
        const { btn } = await setup(consts.VARIATION_FILLED, consts.LABEL_TEXT);
        expect(btn).toBeInTheDocument();
    });
    it('Should added the label', async () => {
        const { btn } = await setup(consts.VARIATION_FILLED, consts.LABEL_TEXT);
        expect(btn.textContent).toContain(consts.LABEL_TEXT);
    });
});

describe('Testing variations', () => {
    it.each(consts.TEST_CASE_VARIATIONS)
        ('Should apply correct class for $type', async ({type, expected}) => {
        const { btn } = await setup(type as TButtonTypes, consts.LABEL_TEXT);
        expect(btn).toHaveClass(expected);
    });
});

describe('Testing state disabled', () => {
    it('Should be disabled', async () => {
        const { btn } = await setup(consts.VARIATION_FILLED, consts.LABEL_TEXT, consts.BOOLEAN_TRUE);
        expect(btn.getAttribute(consts.ATTRS_DISABLED.DISABLED)).toContain(`${consts.BOOLEAN_TRUE}`);
    });
    it('Should be aria-disabled', async () => {
        const { btn } = await setup(consts.VARIATION_FILLED, consts.LABEL_TEXT, consts.BOOLEAN_TRUE);
        expect(btn.getAttribute(consts.ATTRS_DISABLED.ARIA_DISABLED)).toContain(`${consts.BOOLEAN_TRUE}`);
    });
});

describe('Testing interactions', () => {
    it('Should emit click event when clicked', async () => {
        const clickSpy = vi.fn();
        const { btn } = await setup(
            consts.VARIATION_FILLED, 
            consts.LABEL_TEXT, 
            consts.BOOLEAN_FALSE, 
            clickSpy
        );
        await fireEvent.click(btn);
        expect(clickSpy).toHaveBeenCalledTimes(1);
    });
});

describe('Testing keyboard interactions', () => {
    it('Should emit click event when focused with TAB and pressed ENTER', async () => {
        const user = userEvent.setup();
        const clickSpy = vi.fn();
        const { btn } = await setup(
            consts.VARIATION_FILLED, 
            consts.LABEL_TEXT, 
            consts.BOOLEAN_FALSE, 
            clickSpy
        );

        await user.tab();
        expect(btn).toHaveFocus();

        await user.keyboard('{Enter}');
        expect(clickSpy).toHaveBeenCalledTimes(1);
    });
    it('Should NOT emit event with Enter if disabled', async () => {
        const user = userEvent.setup();
        const clickSpy = vi.fn();
        const { btn } = await setup(
            consts.VARIATION_FILLED, 
            consts.LABEL_TEXT, 
            consts.BOOLEAN_TRUE, 
            clickSpy
        );

        await user.tab();
        expect(btn).not.toHaveFocus();

        await user.keyboard('{Enter}');
        expect(clickSpy).not.toHaveBeenCalledTimes(1);
    });
});