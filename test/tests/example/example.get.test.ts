import testFlowHelper from "../../helper/TestFlowHelper";
import exampleHelper from "../../helper/ExampleHelper";
describe("Example get", () => {
    testFlowHelper.testGet(exampleHelper, {
        query: exampleHelper.getDefaultQuery(),
    });
});
