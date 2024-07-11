import React, { useState, useEffect } from "react";
import Web3 from "web3";
import MyTokenContract from "./contracts/MyToken.json";
import { Toast, Input, Button, Space, Card } from "antd-mobile";
import './App.css'; // 引入样式文件

const MyToken = () => {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [ethBalance, setEthBalance] = useState("加载中...");
    const [balance, setBalance] = useState("加载中...");
    const [totalSupply, setTotalSupply] = useState("加载中...");
    const [transferTo, setTransferTo] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [approveSpender, setApproveSpender] = useState("");
    const [approveAmount, setApproveAmount] = useState("");
    const [spender, setSpender] = useState("");
    const [allowance, setAllowance] = useState("加载中...");

    useEffect(() => {
        const init = async () => {
            try {
                if (window.ethereum) {
                    const web3Instance = new Web3(window.ethereum);
                    setWeb3(web3Instance);
                    const accounts = await web3Instance.eth.requestAccounts();
                    setAccounts(accounts);
                    const networkId = await web3Instance.eth.net.getId();
                    const deployedNetwork = MyTokenContract.networks[networkId];
                    const instance = new web3Instance.eth.Contract(
                        MyTokenContract.abi,
                        deployedNetwork && deployedNetwork.address
                    );
                    setContract(instance);

                    const ethBalance = await web3Instance.eth.getBalance(accounts[0]);
                    setEthBalance(web3Instance.utils.fromWei(ethBalance, "ether"));

                    const balance = await instance.methods.balanceOf(accounts[0]).call();
                    setBalance(balance);

                    const totalSupply = await instance.methods.totalSupply().call();
                    setTotalSupply(totalSupply);
                } else {
                    Toast.show({
                        icon: 'fail',
                        content: '请安装 MetaMask！'
                    });
                }
            } catch (error) {
                Toast.show({
                    icon: 'fail',
                    content: `初始化出错`
                });
            }
        };

        init();
    }, [web3]);

    const handleTransfer = async () => {
        try {
            if (!contract || !accounts[0]) {
                Toast.show({
                    icon: 'fail',
                    content: '智能合约或账户未初始化'
                });
                return;
            }

            await contract.methods.transfer(transferTo, transferAmount).send({ from: accounts[0] });
            const updatedBalance = await contract.methods.balanceOf(accounts[0]).call();
            setBalance(updatedBalance);
            Toast.show({
                icon: 'success',
                content: '转账成功'
            });
        } catch (error) {
            Toast.show({
                icon: 'fail',
                content: `转账出错`
            });
        }
    };

    const handleApprove = async () => {
        try {
            if (!contract || !accounts[0]) {
                Toast.show({
                    icon: 'fail',
                    content: '智能合约或账户未初始化'
                });
                return;
            }

            await contract.methods.approve(approveSpender, approveAmount).send({ from: accounts[0] });
            Toast.show({
                icon: 'success',
                content: '授权成功'
            });
        } catch (error) {
            Toast.show({
                icon: 'fail',
                content: `授权出错`
            });
        }
    };

    const handleCheckAllowance = async () => {
        try {
            if (!contract || !accounts[0]) {
                Toast.show({
                    icon: 'fail',
                    content: '智能合约或账户未初始化'
                });
                return;
            }

            const allowance = await contract.methods.allowance(accounts[0], spender).call();
            setAllowance(allowance);
        } catch (error) {
            Toast.show({
                icon: 'fail',
                content: `查询授权额度出错`
            });
        }
    };

    return (
        <div className="container">
            <h2 className="title">我的代币 DApp</h2>
            <Card className="card">
                <p>当前账户地址：{accounts.length > 0 ? accounts[0] : "加载中..."}</p>
                <p>ETH余额：{ethBalance !== "加载中..." ? `${ethBalance} ETH` : "加载中..."}</p>
                <p>余额：{balance !== "加载中..." ? `${balance} MTK` : "加载中..."}</p>
            </Card>

            <h3 className="section-title">转账代币</h3>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                    value={transferTo}
                    onChange={(e) => setTransferTo(e)}
                    placeholder="接收者地址"
                />
                <Input
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e)}
                    placeholder="数量"
                    type="number"
                />
                <Button onClick={handleTransfer} block>转账</Button>
            </Space>

            <h3 className="section-title">授权代币</h3>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                    value={approveSpender}
                    onChange={(e) => setApproveSpender(e)}
                    placeholder="授权者地址"
                />
                <Input
                    value={approveAmount}
                    onChange={(e) => setApproveAmount(e)}
                    placeholder="数量"
                    type="number"
                />
                <Button onClick={handleApprove} block>授权</Button>
            </Space>

            <h3 className="section-title">查询授权额度</h3>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                    value={spender}
                    onChange={(e) => setSpender(e)}
                    placeholder="授权者地址"
                />
                <Button onClick={handleCheckAllowance} block>查询授权额度</Button>
                <p>授权额度：{allowance !== "加载中..." ? `${allowance} MTK` : "加载中..."}</p>
            </Space>
        </div>
    );
};

export default MyToken;
