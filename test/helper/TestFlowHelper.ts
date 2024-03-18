import BasicHelper from "./BasicHelper";
import {testHelper} from "./TestHelper";


class TestFlowHelper {
    testCreate(entityHelper: BasicHelper, params: any = {}, options: any = {}) {
        it('works', async () => {
            await testHelper.prepare();
            try {
                let {entity, entityData} = await entityHelper.create(params);
                //console.log('RESULT', entity);
                await entityHelper.checkDefaultData(entity, params.query ?? {}, {entityData});
            } catch (err) {
                throw err;
            }
        });
    }

    testGet(entityHelper: BasicHelper, params: any = {}, options: any = {}) {
        it('works', async () => {
            await testHelper.prepare();
            try {
                let {entityData, entity} = await entityHelper.generate(params);
                //console.log('RESULT', entityData);
                let res = await entityHelper.get({
                    uid: entity.uid,
                    query: params.query,
                });

                await entityHelper.checkDefaultData(res.entity, params.query ?? {}, {entityData});
            } catch (err) {
                throw err;
            }
        });
    }

    testDelete(entityHelper: BasicHelper, params: any = {}, options: any = {}) {
        it('works', async () => {
            await testHelper.prepare();
            let uid;
            try {
                let {entityData, entity} = await entityHelper.generate(params);
                uid = entity.uid;
                await entityHelper.delete({
                    uid,
                });
            } catch (err) {
                throw err;
            }

            await testHelper.errorCheck(`Entity ${uid} must be deleted`, async (message) => {
                let res = await entityHelper.get({
                    uid,
                    query: params.query,
                });
                if (res) {
                    throw new Error(message);
                }
            });
        });
    }

    testSet(entityHelper: BasicHelper, params: any = {}, options: any = {}) {
        it('works', async () => {
            await testHelper.prepare();
            try {
                let {entityData, entity} = await entityHelper.generate(params);

                for (const [key, value] of Object.entries(params.updateFields)) {
                    await entityHelper.set({
                        uid: entity.uid,
                        params: [
                            {
                                key,
                                value,
                            }
                        ]
                    });
                    entityData[key] = value;
                }
                let res = await entityHelper.get({
                    uid: entity.uid,
                    query: params.query,
                });

                await entityHelper.checkDefaultData(res.entity, params.query ?? {}, {entityData, checkValues: false});
                for (const [key, value] of Object.entries(params.updateFields)) {
                    expect(res.entity[key]).toEqual(value);
                }
            } catch (err) {
                throw err;
            }
        });
    }

    testList(entityHelper: BasicHelper, params: any = {}, options: any = {}) {
        it('works', async () => {
            const createdList = await testHelper.prepareList(entityHelper, params);
            let uids = createdList.map((item) => {
                return item.uid;
            });
            let res = await entityHelper.list({
                params: {
                    where: {
                        key: 'uid',
                        equal: 'in',
                        value: uids,
                    }
                },
                query: params.query || {},
            });
            const list = res.entitiesData;
            expect(list.items.length).toEqual(createdList.length);
            for (const item of list.items) {
                let entity = createdList.find((en) => {
                   return en.uid === item.uid;
                });
                await entityHelper.checkDefaultData(item, params.query ?? {}, {entityData: entity});
            }
        });
    }

}

export default new TestFlowHelper();
