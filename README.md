# NapkinMath

Dependency-free browser calculators: points redemption, Coast FIRE, mortgages, car loans, savings and debt payoff. Preview with `python3 -m http.server 8000`; run `node --test tests/calculations.test.cjs`.

Tests execute the original payment/points functions from `index.html` with a minimal DOM stub. Coverage includes zero-interest, nonpositive term, standard amortization and points net-of-tax behavior, not full browser or every-calculator coverage.

Points value is net cash after taxes, floored at zero, divided by points and multiplied by 100 cents per point, with minimum denominator one. Zero-points input currently yields a large finite number; this documents rather than endorses that guard. Loans assume constant nominal APR, monthly compounding and fixed payments. Coast FIRE uses user-selected returns and withdrawal rate, not a forecast. Taxes, fees, inflation and sequence risk are not universally modeled. Outputs illustrate assumptions, not financial advice.
