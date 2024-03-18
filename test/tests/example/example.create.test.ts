import testFlowHelper from "../../helper/TestFlowHelper";
import exampleHelper from "../../helper/ExampleHelper";
describe("Example Create", () => {
    testFlowHelper.testGet(exampleHelper, {
        query: exampleHelper.getDefaultQuery(),
    });
});
