import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useRef, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function TransactionsPage() {
    const { userData } = useContext(UserContext);
    const { tipo } = useParams();
    const navigate = useNavigate();
    const valueInputRef = useRef(null);
    const descriptionInputRef = useRef(null);

    function sendTransaction(data) {
        axios
            .post(`${import.meta.env.VITE_API_URL}/nova-transacao/${tipo}`, data, {
                headers: { Authorization: `Bearer ${userData.token}` },
            })
            .then(() => {
                navigate("/home");
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    return alert(`${error.response.data}. Error ${error.response.status}: ${error.response.statusText}`);
                }
                alert(error.message);                
            });
    }

    function handleForm(event) {
        event.preventDefault();

        const data = {
            value: Number(valueInputRef.current.value),
            description: descriptionInputRef.current.value,
        }

        if(!isNaN(data.value) && data.value<=0) {
            return alert("Insert a valid value.");
        }

        if(data.description.length===0) {
            return alert("Insert a description.");
        }

        sendTransaction(data);
    }

    useEffect(() =>  {
        if (userData && userData.token) {
            return;
        }
        navigate("/");
    }, []);

    return (
        <TransactionsContainer>
            <h1>Nova TRANSAÇÃO</h1>
            <form onSubmit={handleForm}>
                <input placeholder="Valor" type="number" min="0" step="0.01" required ref={valueInputRef} data-test="registry-amount-input"/>
                <input placeholder="Descrição" type="text" required ref={descriptionInputRef} data-test="registry-name-input"/>
                <button data-test="registry-save">Salvar TRANSAÇÃO</button>
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
