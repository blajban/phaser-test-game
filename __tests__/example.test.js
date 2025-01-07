function add(a, b) {
    return a + b;
}
  

test("adds two numbers correctly", () => {
    const res = add(2, 3);
    expect(res).toBe(5);
});