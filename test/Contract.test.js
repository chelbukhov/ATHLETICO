const assert = require ('assert');              // утверждения
const ganache = require ('ganache-cli');        // тестовая сеть
const Web3 = require ('web3');                  // библиотека для подключения к ефириуму

require('events').EventEmitter.defaultMaxListeners = 0;

const compiledContract = require('../build/Crowdsale.json');

const compiledToken = require('../build/ATHLETICOToken.json');

// старт тестов 01.12.2018
const addTimeToStart = 16; // время в днях до Start Crowdsale 01/12/2018

let accounts;
let contractAddress;
console.log(Date());


describe('Серия тестов для проверки функций расчета бонусов ...', () => {
    let web3 = new Web3(ganache.provider());      // настройка провайдера

    it('Разворачиваем контракт для тестирования...', async () => {

        accounts = await web3.eth.getAccounts();
        contract = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
            .deploy({ data: compiledContract.bytecode })
            .send({ from: accounts[0], gas: '6000000'});
    });

    it('Адрес контракта...', async () => {
        contractAddress = (await contract.options.address);
    });

    it('Получаем развернутый контракт токена...', async () => {
        //получаем адрес токена
        const tokenAddress = await contract.methods.token().call();

        //получаем развернутый ранее контракт токена по указанному адресу
        token = await new web3.eth.Contract(
        JSON.parse(compiledToken.interface),
        tokenAddress
        );
        //console.log("TokenAddress", token);
    });
    
    it('Проверка остатка токенов на адресе teamAddress 10% = 100 млн...', async () => {
        let myAddress = await contract.methods.teamAddress().call();

        let myBalance = await token.methods.balanceOf(myAddress).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 100000000);
        //console.log("teamAddress: ", myBalance);
    });

    it('Проверка остатка токенов на адресе bountyAddress 5% = 50 млн...', async () => {
        let myAddress = await contract.methods.bountyAddress().call();

        let myBalance = await token.methods.balanceOf(myAddress).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 50000000);
        //console.log("bountyAddress: ", myBalance);
    });
/*
    // пополнение средств до начала краудсейла
    it('Переводим от account[2] 5 эфиров, должен отбить...', async () => {
        try {
            await contract.methods.buyTokens(accounts[2]).send({
                from: accounts[2],
                gas: "1000000",
                value: 5*10**18
            });
            assert(false);    
        } catch (error) {
            assert(error);
            //console.log(error);
        }
    });
*/
    // установка начала ICO
    it('Увеличиваем время в ganache-cli на addTimeToStart дней - до 01 декабря', async () => {
        const myVal = await new Promise((resolve, reject) =>
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [60 * 60 * 24 * addTimeToStart],
            id: new Date().getTime()
        }, (error, result) => error ? reject(error) : resolve(result.result))
    );
    });

    it('Переводим от account[2] 5 эфиров, должен принять...', async () => {
        try {
            await contract.methods.buyTokens(accounts[2]).send({
                from: accounts[2],
                gas: "1000000",
                value: 5*10**18
            });
            assert(true);    
        } catch (error) {
            assert(false);
            console.log(error);
        }
    });

    // проверка начисления токенов
    it('Проверка токенов на адресе accounts[2] = 5 * 20000 + бонус 100% = 200 000', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 200000);
        //console.log(myBalance);
    });

    
    it('Увеличиваем время в ganache-cli на 31 дней - до 01 января', async () => {
        const myVal = await new Promise((resolve, reject) =>
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [60 * 60 * 24 * 31],
            id: new Date().getTime()
        }, (error, result) => error ? reject(error) : resolve(result.result))
    );
    });

    it('Переводим от account[2] 5 эфиров, должен принять...', async () => {
        try {
            await contract.methods.buyTokens(accounts[2]).send({
                from: accounts[2],
                gas: "1000000",
                value: 5*10**18
            });
            assert(true);    
        } catch (error) {
            assert(false);
            console.log(error);
        }
    });

    // проверка начисления токенов
    it('Проверка токенов на адресе accounts[2] = 200000  + 5 * 20000 + бонус 50% = 350 000', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 350000);
        //console.log(myBalance);
    });

    it('Увеличиваем время в ganache-cli на 31 дней - до 01 февраля', async () => {
        const myVal = await new Promise((resolve, reject) =>
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [60 * 60 * 24 * 31],
            id: new Date().getTime()
        }, (error, result) => error ? reject(error) : resolve(result.result))
    );
    });

    it('Переводим от account[2] 5 эфиров, должен принять...', async () => {
        try {
            await contract.methods.buyTokens(accounts[2]).send({
                from: accounts[2],
                gas: "1000000",
                value: 5*10**18
            });
            assert(true);    
        } catch (error) {
            assert(false);
            console.log(error);
        }
    });

    // проверка начисления токенов
    it('Проверка токенов на адресе accounts[2] = 350000  + 5 * 20000 + бонус 25% = 475 000', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 475000);
        //console.log(myBalance);
    });


    it('Увеличиваем время в ganache-cli на 28 дней - до 01 марта', async () => {
        const myVal = await new Promise((resolve, reject) =>
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [60 * 60 * 24 * 28],
            id: new Date().getTime()
        }, (error, result) => error ? reject(error) : resolve(result.result))
    );
    });

    it('Переводим от account[2] 5 эфиров, должен принять...', async () => {
        try {
            await contract.methods.buyTokens(accounts[2]).send({
                from: accounts[2],
                gas: "1000000",
                value: 5*10**18
            });
            assert(true);    
        } catch (error) {
            assert(false);
            console.log(error);
        }
    });

    // проверка начисления токенов
    it('Проверка токенов на адресе accounts[2] = 475000  + 5 * 20000 + бонус 0% = 575 000', async () => {

        let myBalance = await token.methods.balanceOf(accounts[2]).call();
        myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 575000);
        //console.log(myBalance);
    });


});

describe('Серия тестов для проверки функций перевода токенов инвесторам...', () => {
    let web3 = new Web3(ganache.provider());      // настройка провайдера

    it('Разворачиваем контракт для тестирования...', async () => {

        accounts = await web3.eth.getAccounts();
        contract = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
            .deploy({ data: compiledContract.bytecode })
            .send({ from: accounts[0], gas: '6000000'});
    });

    it('Адрес контракта...', async () => {
        contractAddress = (await contract.options.address);
    });

    it('Получаем развернутый контракт токена...', async () => {
        //получаем адрес токена
        const tokenAddress = await contract.methods.token().call();

        //получаем развернутый ранее контракт токена по указанному адресу
        token = await new web3.eth.Contract(
        JSON.parse(compiledToken.interface),
        tokenAddress
        );
        //console.log("TokenAddress", token);
    });

    it('Переводим токены на адрес account[3]...', async () => {
        try {
            await contract.methods.transferTokens(accounts[3], 1000).send({
                from: accounts[0],
                gas: "1000000",
            });
            assert(true);    
        } catch (error) {
            assert(false);
            //console.log(error);
        }
    });

    // проверка начисления токенов
    it('Проверка токенов на адресе accounts[3] = 1000', async () => {

        let myBalance = await token.methods.balanceOf(accounts[3]).call();
        //myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 1000);
        //console.log(myBalance);
    });

    it('Переводим токены на адрес account[3] с пом. ф-ции mint...должен отбить. только по окончании Crowdsale', async () => {
        try {
            await contract.methods.mintTokensToWinners(accounts[3], 1000).send({
                from: accounts[0],
                gas: "1000000",
            });
            assert(false);    
        } catch (error) {
            assert(error);
            //console.log(error);
        }
    });
    

// установка начала ICO
it('Увеличиваем время в ganache-cli на addTimeToStart дней - до 01 декабря', async () => {
    const myVal = await new Promise((resolve, reject) =>
    web3.currentProvider.sendAsync({
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [60 * 60 * 24 * addTimeToStart],
        id: new Date().getTime()
    }, (error, result) => error ? reject(error) : resolve(result.result))
);
});

    it('Переводим от account[4] 90 эфиров ...', async () => {
        try {
            await contract.methods.buyTokens(accounts[4]).send({
                from: accounts[4],
                gas: "1000000",
                value: 90*10**18
            });
            assert(true);    
        } catch (error) {
            assert(false);
            //console.log(error);
        }
    });

    it('Переводим от account[5] 90 эфиров ...', async () => {
        try {
            await contract.methods.buyTokens(accounts[5]).send({
                from: accounts[5],
                gas: "1000000",
                value: 90*10**18
            });
            assert(true);    
        } catch (error) {
            assert(false);
            //console.log(error);
        }
    });

    it('Переводим от account[6] 90 эфиров ...', async () => {
        try {
            await contract.methods.buyTokens(accounts[6]).send({
                from: accounts[6],
                gas: "1000000",
                value: 90*10**18
            });
            assert(true);    
        } catch (error) {
            assert(false);
            //console.log(error);
        }
    });

    it('Завершаем Crowdsale по достижению софткап ...', async () => {
        try {
            await contract.methods.finishCrowdSale().send({
                from: accounts[9],
                gas: "1000000"
            });
            assert(true);    
        } catch (error) {
            assert(false);
            //console.log(error);
        }
    });

    it('Переводим токены на адрес account[3] с пом. ф-ции mint...должен работать', async () => {
        try {
            await contract.methods.mintTokensToWinners(accounts[3], 1000).send({
                from: accounts[0],
                gas: "1000000",
            });
            assert(true);    
        } catch (error) {
            assert(false);
            //console.log(error);
        }
    });

    // проверка начисления токенов
    it('Проверка токенов на адресе accounts[3] = 2000', async () => {

        let myBalance = await token.methods.balanceOf(accounts[3]).call();
        //myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 2000);
        //console.log(myBalance);
    });

    it('Переводим токены на адрес account[8] с пом. штатной ф-ции transfer... ', async () => {
        try {
            await token.methods.transfer(accounts[8], 1000).send({
                from: accounts[3],
                gas: "1000000",
            });
            assert(true);    
        } catch (error) {
            assert(false);
            //console.log(error);
        }
    });
    
    // проверка начисления токенов
    it('Проверка токенов на адресе accounts[8] = 1000', async () => {

        let myBalance = await token.methods.balanceOf(accounts[8]).call();
        //myBalance = web3.utils.fromWei(myBalance, 'ether');
        assert(myBalance == 1000);
        //console.log(myBalance);
    });


    it('Проверка баланса на account[9] - ...', async () => {
        accBalance = await web3.eth.getBalance(accounts[9]);
        accBalance = web3.utils.fromWei(accBalance, 'ether');
        assert(accBalance < 100);
        //console.log("Balance of account[9] before withdraw: ", accBalance);
    });



    it('Проверка вывода профита withdrawFunds... ', async () => {
        try {
            await contract.methods.withdrawFunds(accounts[9], "100000000000000000000").send({ //100 ether
                from: accounts[0],
                gas: "1000000",
            });
            assert(true);    
        } catch (error) {
            assert(false);
            //console.log(error);
        }
    });

    it('Проверка баланса на account[9] - ...', async () => {
        accBalance = await web3.eth.getBalance(accounts[9]);
        accBalance = web3.utils.fromWei(accBalance, 'ether');
        assert(accBalance > 190);
        //console.log("Balance of account[9] after withdraw: ", accBalance);
    });
});


describe('Серия тестов для проверки функций возврата средств инвесторам (refund)...', () => {
    let web3 = new Web3(ganache.provider());      // настройка провайдера

    it('Разворачиваем контракт для тестирования...', async () => {

        accounts = await web3.eth.getAccounts();
        contract = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
            .deploy({ data: compiledContract.bytecode })
            .send({ from: accounts[0], gas: '6000000'});
    });

    it('Адрес контракта...', async () => {
        contractAddress = (await contract.options.address);
    });

    it('Получаем развернутый контракт токена...', async () => {
        //получаем адрес токена
        const tokenAddress = await contract.methods.token().call();

        //получаем развернутый ранее контракт токена по указанному адресу
        token = await new web3.eth.Contract(
        JSON.parse(compiledToken.interface),
        tokenAddress
        );
        //console.log("TokenAddress", token);
    });

    // установка начала ICO
    it('Увеличиваем время в ganache-cli на addTimeToStart дней - до 01 декабря', async () => {
        const myVal = await new Promise((resolve, reject) =>
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [60 * 60 * 24 * addTimeToStart],
            id: new Date().getTime()
        }, (error, result) => error ? reject(error) : resolve(result.result))
    );
    });

    it('Переводим от account[5] 10 эфиров ...', async () => {
        try {
            await contract.methods.buyTokens(accounts[5]).send({
                from: accounts[5],
                gas: "1000000",
                value: 10*10**18
            });
            assert(true);    
        } catch (error) {
            assert(false);
            //console.log(error);
        }
    });

    it('Увеличиваем время в ganache-cli на 182 дней - до 01 июня 2019', async () => {
        const myVal = await new Promise((resolve, reject) =>
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [60 * 60 * 24 * 182],
            id: new Date().getTime()
        }, (error, result) => error ? reject(error) : resolve(result.result))
    );
    });


    it('Завершаем Crowdsale по достижению предела времени ...', async () => {
        try {
            await contract.methods.finishCrowdSale().send({
                from: accounts[5],
                gas: "1000000"
            });
            assert(true);    
        } catch (error) {
            assert(false);
            //console.log(error);
        }
    });

    it('Проверяем стади контракта - это refund ...', async () => {
        try {
            let stage = await contract.methods.currentState().call();
            assert(stage == 2);    
            //console.log(stage);
        } catch (error) {
            assert(false);
            //console.log(error);
        }
    });

    it('Проверка баланса на account[5] - ...', async () => {
        accBalance = await web3.eth.getBalance(accounts[5]);
        accBalance = web3.utils.fromWei(accBalance, 'ether');
        assert(accBalance < 90);
        console.log("Balance of account[5] before withdraw: ", accBalance);
    });

    it('Выполняем функицю возврата средств ...', async () => {
        try {
            await contract.methods.refund().send({
                from: accounts[5],
                gas: "1000000"
            });
            assert(true);    
        } catch (error) {
            assert(false);
            //console.log(error);
        }
    });

    it('Проверка баланса на account[5] - ...', async () => {
        accBalance = await web3.eth.getBalance(accounts[5]);
        accBalance = web3.utils.fromWei(accBalance, 'ether');
        assert(accBalance > 98);
        console.log("Balance of account[5] after withdraw: ", accBalance);
    });

});


