import React, { useState } from "react";
import "./App.scss";

const KEYS = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    plus: 10,
    minus: 11,
    multiply: 12,
    divide: 13,
    point: 14,
    del: 15,
    reset: 16,
    equal: 17,
};

function includesSymbol(str) {
    return /\+|-|\/|\*/i.test(str);
}

function App() {
    const [themeId, setThemeId] = React.useState(1);
    document.body.className = `theme-${themeId}`;

    // TODO: switch to state machine like state
    const [display, setDisplay] = React.useState("");
    const [equation, setEquation] = React.useState("");
    const [isNewInput, setIsNewInput] = React.useState(true);
    const [isDone, setIsDone] = React.useState(false);

    React.useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    });

    /**
     * super simplified handling to allow number input via keyboard
     * TODO: symbols
     */
    function handleKeyDown(event) {
        if (+event.key <= 9) {
            handlePress(event.key);
        }
    }

    function calculate() {
        const sanitizedCalculation = `${equation}${display}`.replace(/[^-()\d/*+.]/g, "");
        const sum = eval(sanitizedCalculation);
        setDisplay(sum);
        return sum;
    }

    function reset() {
        setDisplay("");
        setEquation("");
        setIsNewInput(true);
        setIsDone(false);
    }

    /**
     * @param symbol {'+'|'-'|'/'|'*'}
     */
    function addToCalculation(symbol) {
        // we need a number to add to
        if (!display) {
            return;
        }
        // first entry to our calculation
        if (!equation) {
            setEquation(`${display}${symbol}`);
        } else if (includesSymbol(equation)) {
            const sum = calculate();
            setEquation((equation) => `${sum}${symbol}`);
        } else {
            setEquation((equation) => `${equation}${display}${symbol}`);
        }

        setIsNewInput(true);
    }

    function handlePress(key) {
        if (key === KEYS.zero && display === "0" && !display.includes(".")) {
            return; // we dont want chained zeros
        }

        // new number input after symbol
        if (includesSymbol(equation.substr(-1)) && isNewInput && key < 10) {
            setDisplay(key);
            setIsNewInput(false);
            return;
        }

        // special key press
        if (key >= 10) {
            // dont do anything when a special key is pressed after a finished calculation
            if (isDone && key !== KEYS.reset) {
                return;
            }
            switch (key) {
                case KEYS.reset:
                    reset();
                    return;
                case KEYS.del:
                    if (display.length) {
                        setDisplay((display) => display.slice(0, -1));
                    }
                    return;
                case KEYS.point:
                    // can only have a single floating point
                    if (display.toString().includes(".")) {
                        return;
                    }
                    setDisplay((display) => `${display}.`);
                    return;
                case KEYS.plus:
                    addToCalculation("+");
                    return;
                case KEYS.minus:
                    addToCalculation("-");
                    return;
                case KEYS.divide:
                    addToCalculation("/");
                    return;
                case KEYS.multiply:
                    addToCalculation("*");
                    return;
                case KEYS.equal:
                    if (!equation || !display) {
                        return;
                    }
                    calculate();
                    setEquation(`${equation}${display}=`);
                    setIsDone(true);
                    return;
                default:
                    throw new Error("Invalid KEY value supplied to `handlePress()`");
            }
        }

        // new input after finished calculation
        if (isDone) {
            reset();
        }

        // normal number input
        setDisplay((display) => `${display}${key}`);
        setIsNewInput(false);
    }

    return (
        <div className="App">
            <header className="header">
                <h1 className="header__title">calc</h1>
                <div className="theme">
                    <div className="theme__labels">
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                    </div>
                    <div className="theme__control">
                        <div className="theme__title">theme</div>
                        <div
                            className="theme__switch"
                            onClick={() => {
                                if (themeId === 3) {
                                    setThemeId(1);
                                } else {
                                    setThemeId((id) => id + 1);
                                }
                            }}
                        >
                            <span
                                className="theme__switch-handle"
                                style={{ transform: `translateX(${(themeId - 1) * 22}px)` }}
                            ></span>
                        </div>
                    </div>
                </div>
            </header>
            <main className="display">
                <div className="display__container">
                    <div className="display__equation" data-testid="equation">
                        {equation}
                    </div>
                    <div className="display__value" role="alert">
                        {display}
                    </div>
                </div>
            </main>
            <div className="keypad" role="form">
                <div className="button-grid">
                    <button className="button" onClick={() => handlePress(KEYS.seven)}>
                        7
                    </button>
                    <button className="button" onClick={() => handlePress(KEYS.eight)}>
                        8
                    </button>
                    <button className="button" onClick={() => handlePress(KEYS.nine)}>
                        9
                    </button>
                    <button
                        className="button button--secondary uppercase text-sm"
                        onClick={() => handlePress(KEYS.del)}
                    >
                        del
                    </button>
                    <button className="button" onClick={() => handlePress(KEYS.four)}>
                        4
                    </button>
                    <button className="button" onClick={() => handlePress(KEYS.five)}>
                        5
                    </button>
                    <button className="button" onClick={() => handlePress(KEYS.six)}>
                        6
                    </button>
                    <button className="button" onClick={() => handlePress(KEYS.plus)}>
                        +
                    </button>
                    <button className="button" onClick={() => handlePress(KEYS.one)}>
                        1
                    </button>
                    <button className="button" onClick={() => handlePress(KEYS.two)}>
                        2
                    </button>
                    <button className="button" onClick={() => handlePress(KEYS.three)}>
                        3
                    </button>
                    <button className="button" onClick={() => handlePress(KEYS.minus)}>
                        -
                    </button>
                    <button className="button" onClick={() => handlePress(KEYS.point)}>
                        .
                    </button>
                    <button className="button" onClick={() => handlePress(KEYS.zero)}>
                        0
                    </button>
                    <button className="button" onClick={() => handlePress(KEYS.divide)}>
                        /
                    </button>
                    <button className="button" onClick={() => handlePress(KEYS.multiply)}>
                        x
                    </button>
                    <button
                        className="button button--double button--secondary uppercase text-sm"
                        onClick={() => handlePress(KEYS.reset)}
                    >
                        reset
                    </button>
                    <button
                        className="button button--double button--primary text-sm"
                        onClick={() => handlePress(KEYS.equal)}
                    >
                        =
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
