import styled from "styled-components";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Transaction({ transactionInfo, token, getUserInfo }) {
    const {date, description, type, value, id} = transactionInfo;
    const navigate = useNavigate();

    function deleteTransaction() {
        if(confirm("Delete transaction?")) {
            axios
            .delete(`${import.meta.env.VITE_API_URL}/deleta-transacao/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                getUserInfo();
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    return alert(`${error.response.data}. Error ${error.response.status}: ${error.response.statusText}`);
                }
                alert(error.message);                
            });
        }
    }

    return (
        <ListItemContainer>
            <div>
                <span>{dayjs(date).format("DD/MM")}</span>
                <strong  onClick={() => navigate(`/editar-registro/${type}/${id}`)} data-test="registry-name">{description}</strong>
            </div>
            <div>
                <Value color={type === "entrada"? "positivo":"negativo"} data-test="registry-amount">
                    {Math.abs(value).toFixed(2).replace('.', ',')}
                </Value>
                <span onClick={deleteTransaction} data-test="registry-delete">x</span>
            </div>
        </ListItemContainer>
    )
}

const Value = styled.div`
    font-size: 16px;
    text-align: right;
    color: ${(props) => (props.color === "positivo" ? "#00ff00" : "#ff0000")};
`;
const ListItemContainer = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    color: #000000;
    margin-right: 10px;
    div span {
        color: #c6c6c6;
        margin-right: 10px;
    }
    div span:nth-child(2) {
        margin-left: 15px;
        margin-right: 0;
        cursor: pointer;
    }
    div {
        display: flex;
    }
`;
