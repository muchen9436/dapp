import React, { useState, useEffect } from "react";
import Web3 from "web3";
import MyTokenContract from "./contracts/MyToken.json";

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
                    console.error("请安装 MetaMask！");
                }
            } catch (error) {
                console.error("初始化出错:", error);
            }
        };

        init();
    }, []);

    const handleTransfer = async () => {
        try {
            if (!contract || !accounts[0]) {
                console.error("智能合约或账户未初始化");
                return;
            }

            await contract.methods.transfer(transferTo, transferAmount).send({ from: accounts[0] });
            const updatedBalance = await contract.methods.balanceOf(accounts[0]).call();
            setBalance(updatedBalance);
        } catch (error) {
            console.error("转账出错:", error);
        }
    };

    const handleApprove = async () => {
        try {
            if (!contract || !accounts[0]) {
                console.error("智能合约或账户未初始化");
                return;
            }

            await contract.methods.approve(approveSpender, approveAmount).send({ from: accounts[0] });
        } catch (error) {
            console.error("授权出错:", error);
        }
    };

    const handleCheckAllowance = async () => {
        try {
            if (!contract || !accounts[0]) {
                console.error("智能合约或账户未初始化");
                return;
            }

            const allowance = await contract.methods.allowance(accounts[0], spender).call();
            setAllowance(allowance);
        } catch (error) {
            console.error("查询授权额度出错:", error);
        }
    };

    const handleReceiveAirdrop = async () => {
        try {
            if (!contract || !accounts[0]) {
                console.error("智能合约或账户未初始化");
                return;
            }

            const receipt = await contract.methods.airdrop().send({ from: accounts[0] });
            console.log("接收空投成功:", receipt);
            const updatedBalance = await contract.methods.balanceOf(accounts[0]).call();
            setBalance(updatedBalance);
        } catch (error) {
            console.error("接收空投出错:", error);
        }
    };

    return (
        <div>
            <h2>我的代币 DApp</h2>
            <p>当前账户地址：{accounts.length > 0 ? accounts[0] : "加载中..."}</p>
            <p>ETH余额：{ethBalance !== "加载中..." ? `${ethBalance} ETH` : "加载中..."}</p>
            <p>余额：{balance !== "加载中..." ? `${balance} MTK` : "加载中..."}</p>
            <p>总供应量：{totalSupply !== "加载中..." ? `${totalSupply} MTK` : "加载中..."}</p>

            <h3>转账代币</h3>
            <input
                type="text"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                placeholder="接收者地址"
            />
            <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="数量"
            />
            <button onClick={handleTransfer}>转账</button>

            <h3>授权代币</h3>
            <input
                type="text"
                value={approveSpender}
                onChange={(e) => setApproveSpender(e.target.value)}
                placeholder="授权者地址"
            />
            <input
                type="number"
                value={approveAmount}
                onChange={(e) => setApproveAmount(e.target.value)}
                placeholder="数量"
            />
            <button onClick={handleApprove}>授权</button>

            <h3>查询授权额度</h3>
            <input
                type="text"
                value={spender}
                onChange={(e) => setSpender(e.target.value)}
                placeholder="授权者地址"
            />
            <button onClick={handleCheckAllowance}>查询授权额度</button>
            <p>授权额度：{allowance !== "加载中..." ? `${allowance} MTK` : "加载中..."}</p>

            <h3>接收空投</h3>
            <button onClick={handleReceiveAirdrop}>接收空投</button>
        </div>
    );
};

export default MyToken;
