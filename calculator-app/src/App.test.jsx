import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import App from "./App";

/**
 * @param input {string | string[]}
 */
function press(input) {
    if (Array.isArray(input)) {
        input.forEach((i) => {
            fireEvent.click(screen.getByRole("button", { name: i }));
        });
        return;
    }

    fireEvent.click(screen.getByRole("button", { name: input }));
}

beforeEach(() => {
    render(<App />);
});

describe("App", () => {
    it("renders the app", () => {
        expect(screen.getByRole("heading", { name: "calc" })).toBeInTheDocument();
    });

    it("prevents the user from prepending zeros", () => {
        press([0, 0, 0, 1, 2, 3]);
        expect(screen.getByRole("alert")).toHaveTextContent("123");
    });

    it("allows inputting a multi-character number", () => {
        press([1, 2, 3]);
        expect(screen.getByRole("alert")).toHaveTextContent("123");
    });

    it("allows deleting from the display per character", () => {
        press([1, 2, 3]);
        expect(screen.getByRole("alert")).toHaveTextContent("123");
        press("del");
        expect(screen.getByRole("alert")).toHaveTextContent("12");
    });

    it("RESET button resets display and equation", () => {
        press([1, 2, 3, "+", 4, 5, "-", 2]);
        press("reset");
        expect(screen.getByRole("alert")).toBeEmptyDOMElement();
        expect(screen.getByTestId("equation")).toBeEmptyDOMElement();
    });

    it("shows the equation after pressing a symbol", () => {
        press([2, 2, "+"]);
        expect(screen.getByTestId("equation")).toHaveTextContent("22+");
    });

    it("appends to the equation after entering a number again", () => {
        press([2, 2, "+"]);
        expect(screen.getByTestId("equation")).toHaveTextContent("22+");
        press([2, "="]);
        expect(screen.getByRole("alert")).toHaveTextContent("24");
    });

    it("resets after a finished calculation", () => {
        press([2, 2, "+"]);
        expect(screen.getByTestId("equation")).toHaveTextContent("22+");
        press(["="]);
        expect(screen.getByRole("alert")).toHaveTextContent("44");
        press("1");
        expect(screen.getByRole("alert")).toHaveTextContent("1");
    });

    it("allows floating point input, and ignores repeated points", () => {
        press([1, ".", ".", 2, ".", 5]);
        expect(screen.getByRole("alert")).toHaveTextContent("1.25");
        press(["x", 1, ".", 5, 0]);
        expect(screen.getByRole("alert")).toHaveTextContent("1.50");
    });

    it("immediately calculates when symbol is pressed the second time", () => {
        press([2, "+", 2, "+"]);
        expect(screen.getByTestId("equation")).toHaveTextContent("4+");
        expect(screen.getByRole("alert")).toHaveTextContent("4");
    });
});
