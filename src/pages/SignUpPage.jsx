import { Link } from "react-router-dom";
import styled from "styled-components";
import MyWalletLogo from "../components/MyWalletLogo";
import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
    const navigate = useNavigate();

    const nameInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const confirmPasswordInputRef = useRef(null);

    function registerUser(data) {
        axios
            .post(`${import.meta.env.VITE_API_URL}/cadastro`, data)
            .then(() => navigate("/"))
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    return alert(`${error.response.data}. Error ${error.response.status}: ${error.response.statusText}`);
                }
                return alert(error.message);                
            });
    }

    function handleForm(event) {
        event.preventDefault();

        const data = {
            name: nameInputRef.current.value,
            email: emailInputRef.current.value,
            password: passwordInputRef.current.value,
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (data.password.length < 3) {
            return alert("Password must have at least 3 characters");
        }

        if (!emailPattern.test(data.email)) {
            return alert("Invalid email address");
        }

        if (data.password !== confirmPasswordInputRef.current.value) {
            return alert("Passwords don't match");
        }

        registerUser(data);
    }

    return (
        <SingUpContainer>
            <form onSubmit={handleForm}>
                <MyWalletLogo />
                <input ref={nameInputRef} placeholder="Nome" type="text" required/>
                <input ref={emailInputRef} placeholder="E-mail" type="email" required/>
                <input ref={passwordInputRef} placeholder="Senha" type="password" autoComplete="new-password" required/>
                <input
                    ref={confirmPasswordInputRef}
                    placeholder="Confirme a senha"
                    type="password"
                    autoComplete="new-password"
                    required
                />
                <button>Cadastrar</button>
            </form>

            <Link to={"/"}>Já tem uma conta? Entre agora!</Link>
        </SingUpContainer>
    );
}

const SingUpContainer = styled.section`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
