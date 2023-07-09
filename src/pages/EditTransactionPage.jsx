import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function TransactionsPage() {
    const { userData } = useContext(UserContext);
    const { tipo, id } = useParams();
    const navigate = useNavigate();
    const [valueInput, setValueInput] = useState(null);
    const [descriptionInput, setDescriptionInput] = useState(null);
    
    function findTransactionInfo(data) {
        const transaction = data.transactions.find(transaction => transaction.id === Number(id));
        setValueInput(transaction.value);
        setDescriptionInput(transaction.description);
    }

    function getUserInfo() {
        axios
            .get(`${import.meta.env.VITE_API_URL}/home`, {
                headers: { Authorization: `Bearer ${userData.token}` },
            })
            .then((response) => {
                findTransactionInfo(response.data);
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    return alert(`${error.response.data}. Error ${error.response.status}: ${error.response.statusText}`);
                }
                return alert(error.message);                
            });
    }

    function sendTransaction(data) {
        axios
            .put(`${import.meta.env.VITE_API_URL}/editar-registro/${tipo}/${id}`, data, {
                headers: { Authorization: `Bearer ${userData.token}` },
            })
            .then(() => {
                navigate("/home");
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    return alert(
                        `${error.response.data}. Error ${error.response.status}: ${error.response.statusText}`
                    );
                }
                alert(error.message);
            });
    }

    function handleForm(event) {
        event.preventDefault();

        const data = {
            value: Number(valueInput),
            description: descriptionInput,
        };

        if (!isNaN(data.value) && data.value <= 0) {
            return alert("Insert a valid value.");
        }

        if (data.description.length === 0) {
            return alert("Insert a description.");
        }

        sendTransaction(data);
    }

    useEffect(() => {
        if (userData && userData.token) {
            getUserInfo();
            return;
        }
        navigate("/");
    }, []);

    return (
        <TransactionsContainer>
            <h1>{`Editar ${tipo}`}</h1>
            <form onSubmit={handleForm}>
                <input
                    placeholder="Valor"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={valueInput}
                    onChange={(event) => setValueInput(event.target.value)}
                    data-test="registry-amount-input"
                />
                <input
                    placeholder="Descrição"
                    type="text"
                    required
                    value={descriptionInput}
                    onChange={(event) => setDescriptionInput(event.target.value)}
                    data-test="registry-name-input"
                />
                <button data-test="registry-save">{`Atualizar ${tipo}`}</button>
            </form>
        </TransactionsContainer>
    );
}

const TransactionsContainer = styled.main`
    height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    h1 {
        align-self: flex-start;
        margin-bottom: 40px;
    }
`;
