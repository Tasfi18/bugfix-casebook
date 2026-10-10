import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { VARIANT } from "../../variant";

const { OrderList } = await import(VARIANT === "before" ? "./before" : "./after");

const render = (state: object) => renderToStaticMarkup(<OrderList state={state} />);

describe(`01 · orders page crash (${VARIANT})`, () => {
  it("shows a loading message instead of crashing while data loads", () => {
    expect(render({})).toContain("Loading orders");
  });

  it("shows the error message when the request fails", () => {
    expect(render({ error: "Network error" })).toContain("Could not load orders: Network error");
  });

  it("shows an empty state when there are no orders", () => {
    expect(render({ data: { items: [] } })).toContain("No orders yet.");
  });

  it("still lists orders once they arrive", () => {
    const html = render({ data: { items: [{ id: "1", customer: "Nadia", total: 14.8 }] } });
    expect(html).toContain("Nadia: $14.80");
  });
});
