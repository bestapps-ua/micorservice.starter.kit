import testFlowHelper from "../../helper/TestFlowHelper";
import exampleHelper from "../../helper/ExampleHelper";

describe("Example Set", () => {

    testFlowHelper.testSet(exampleHelper, {
        query: exampleHelper.getDefaultQuery(),
        updateFields: {
            name: 'Updated',
        }
    });
});
