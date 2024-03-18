import ApiExample from "../entity/ApiExample";
import EntityModel from "./EntityModel";

class ExampleModel extends EntityModel {

}

export default new ExampleModel({
    path: 'v1.example',
    entity: ApiExample,
});
