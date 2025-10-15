const { test, expect } =  require('@playwright/test');

test('First Test Case' , async ({page}) => {
    expect(1).toBe(1);
});
test('Second Test Case' , async ({page}) => {
    expect(1).toBe(2);
});
test('Third Test Case' , async ({page}) => {
    expect(3).toBe(3.0);
});
test('Fourth Test Case' , async ({page}) => {
    expect(false).toBeFalsy();
});
test('Fifth Test Case' , async ({page}) => {
    expect(true).toBeTruthy();
    
});