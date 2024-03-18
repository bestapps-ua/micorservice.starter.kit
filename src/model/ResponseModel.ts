import Example from "../entity/Example";

let config = require('config');

class ResponseModel {
    async getSuccessResponse() {
        return {
            ok: true,
            data: {},
        }
    }

    async getExampleResponse(example: Example, query: any = {}) {
        let data = await this.getExample(example, query);
        let response = await this.getSuccessResponse();
        response.data = data;
        return response;
    }

    async getExample(example: Example, query: any = {}) {
        let data: any = {
            parent: undefined,
            user: undefined,
            uid: example.uid,
            name: example.name,
            status: example.status,
            type: example.type,
            position: example.position,
            data: example.data,
            updated: example.updated,
            created: example.created,
            _type: 'example',
        };
        if (query.parent) {
            let parent = await example.parent;

            if (parent) {
                data.parent = await this.getExample(parent, query);
            }
        }

        return data;
    }

    async getExamplePageListResponse(items: Example[], count: number, page: number, limit: number, query: any = {}) {
        let p = [];
        for (const item of items) {
            p.push(new Promise(async (resolve, reject) => {
                try {
                    let document = await this.getExample(item, query);
                    resolve(document);
                } catch (err) {
                    reject(err);
                }
            }));
        }
        return await this.getSuccessListResponse(p, count, page, limit);
    }

    private async getSuccessListResponse(p: Promise<any>[], count: number, page: number, limit: number) {
        let response = await this.getSuccessResponse();
        let data = await new Promise((resolve, reject) => {
            Promise.all(p).then((list) => {
                let pages = Math.ceil(count / limit);
                resolve({
                    items: list,
                    pager: {
                        count,
                        page,
                        pages,
                        limit,
                    },
                    '_type': 'list',
                });
            }).catch((err) => {
                reject(err);
            });
        });
        response.data = data;
        return response;
    }
}

export default new ResponseModel();
