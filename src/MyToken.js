import React, { useState, useEffect } from "react";
import Web3 from "web3";
import MyTokenContract from "./contracts/MyToken.json";

const MyToken = () => {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [ethBalance, setEthBalance] = useState(null); // 存储 ETH 余额
    const [balance, setBalance] = useState("加载中...");
    const [totalSupply, setTotalSupply] = useState("加载中...");
    const [transferTo, setTransferTo] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [approveSpender, setApproveSpender] = useState("");
    const [approveAmount, setApproveAmount] = useState("");
    const [spender, setSpender] = useState("");
    const [allowance, setAllowance] = useState(0);
    const [decimals, setDecimals] = useState(null); // 添加 decimals 状态`


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
                    const balance = await instance.methods.balanceOf(accounts[0]).call();
                    setBalance(web3Instance.utils.fromWei(balance, "ether"));
                    // 获取并设置 ETH 余额
                    const ethBalance = await web3Instance.eth.getBalance(accounts[0]);
                    setEthBalance(web3Instance.utils.fromWei(ethBalance, "ether"));
                    const totalSupply = await instance.methods.totalSupply().call();
                    setTotalSupply(web3Instance.utils.fromWei(totalSupply, "ether"));
                    // 获取 decimals 值
                    const decimals = await instance.methods.decimals().call();
                    setDecimals(decimals);
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
            await contract.methods.transfer(transferTo, web3.utils.toWei(transferAmount, "ether")).send({ from: accounts[0] });
            const updatedBalance = await contract.methods.balanceOf(accounts[0]).call();
            setBalance(web3.utils.fromWei(updatedBalance, "ether"));
        } catch (error) {
            console.error("转账出错:", error);
        }
    };

    const handleApprove = async () => {
        try {
            await contract.methods.approve(approveSpender, web3.utils.toWei(approveAmount, "ether")).send({ from: accounts[0] });
        } catch (error) {
            console.error("授权出错:", error);
        }
    };

    const handleCheckAllowance = async () => {
        try {
            const allowance = await contract.methods.allowance(accounts[0], spender).call();
            setAllowance(web3.utils.fromWei(allowance, "ether"));
        } catch (error) {
            console.error("查询授权额度出错:", error);
        }
    };

    const formatBalance = () => {
        if (!web3 || balance === null) {
            return "加载中...";
        }
        const balanceInUnits = balance * 10 ** 18; // 固定使用 18 作为 decimals
        return `${balanceInUnits.toFixed(18)} MTK`;
    };


    return (
        <div>
            <h2>我的代币 DApp</h2>
            <p>当前账户地址：{accounts.length > 0 ? accounts[0] : "加载中..."}</p>
            <p>ETH余额：{web3 && ethBalance !== null ? `${ethBalance} ETH` : "加载中..."}</p>
            <p>代币余额：{formatBalance()}</p>
            {/*<p>总供应量：{totalSupply === "加载中..." ? totalSupply : `${totalSupply} MTK`}</p>*/}

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
            <p>授权额度：{allowance} MTK</p>
        </div>
    );
};

export default MyToken;
