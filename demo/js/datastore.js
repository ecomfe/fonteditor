/**
 * @file 测试DataStore
 * @author mengke01(kekee000@gmail.com)
 */

import DataStore from 'common/DataStore';


const entry = {

    /**
     * 初始化
     */
    init() {

        let store = new DataStore({
            name: 'test',
            storeName: 'test-project'
        });

        store.open(function (e) {

            store.add(1001, 'sssss', function () {
                store.clear();
                store.close();
            });

        }, function (e) {
            console.log(e);
        });

        let store1 = new DataStore({
            name: 'test',
            storeName: 'test-project-1'
        });

        store1.open(function () {
            store.removeStore('test-project-1');
            store.close();
        });
    }
};

entry.init();
