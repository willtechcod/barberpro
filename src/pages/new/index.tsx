import { useState, ChangeEvent, useEffect } from "react";
import Head from "next/head";
import { Sidebar } from "../../components/sidebar";

import {
    Flex,
    Heading,
    Text,
    Button,
    Input,
    Select,
} from '@chakra-ui/react';

import Link from "next/link";

import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import {useRouter} from 'next/router';
import { FiChevronLeft } from "react-icons/fi";

interface HaircutProps{
    id: string;
    name: string;
    price: string | number;
    status: boolean;
    user_id: string;
}

interface NewProps{
    haircuts: HaircutProps[];
}

export default function New({haircuts}: NewProps){
    const router = useRouter();

    const [customer, setCustomer] = useState('');
    const [haircutSelected, setHaircutSelected] = useState(haircuts[0]);

    function handleChangeSelect(id: string){
        const haircutItem = haircuts.find(item => item.id === id);
        setHaircutSelected(haircutItem);
    }

    async function handleRegister() {
        if(customer === ''){
            alert("Preencha nome do cliente!");
            return;
        }

        try {

            const apiClient = setupAPIClient();
            await apiClient.post('/schedule', {
                customer: customer,
                haircut_id: haircutSelected?.id
            })
            alert("Agendamento de cliente realizado com sucesso!");
            router.push('/dashboard');

        } catch (err) {

            console.log(err);
            alert("Erro ao a Agendar!");

        }
    }

    return(
        <>
            <Head>
                <title>BarberPró - Novo agendamento</title>
            </Head>
            <Sidebar>
                <Flex direction="column" align="flex-start" justify="flex-start">
                    <Flex
                    direction="row"
                    w="100%"
                    align="center"
                    justify="flex-start"
                    >
                        <Link href="/dashboard">
                        <Button
                        p={4}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg="gray.700"
                        _hover={{bg: "gray.600"}}
                        color="white"
                        mr={3}
                        >
                            <FiChevronLeft size={22} color="#FFF" />
                            Voltar
                        </Button>
                    </Link>

                        <Heading color="red.900" fontSize="2xl" mt={4} mb={4} mr={4}>
                            Novo Agendamento
                        </Heading>
                    </Flex>
                    <Flex
                            maxW="700px"
                            pt={8}
                            pb={8}
                            width="100%"
                            direction="column"
                            align="center"
                            justify="center"
                            bg="barber.400"
                            rounded={10}
                            >

                                <Input 
                                placeholder="Nome do cliente"
                                color="gray.400"
                                w="85%"
                                mb={3}
                                size="md"
                                type="text"
                                bg="barber.900"
                                value={customer}
                                onChange={(e: ChangeEvent<HTMLInputElement>)=> setCustomer(e.target.value)}
                                />

                                <Select bg="barber.900" color="#fba931" mb={3} size="md" w="85%" onChange={(e)=> handleChangeSelect(e.target.value)} >
                                    {haircuts?.map(item => (
                                        <option  key={item?.id} value={item?.id}>{item?.name}</option>
                                    ))}
                                </Select>

                                <Button
                                w="85%"
                                size="md"
                                color="white"
                                bg="button.cta"
                                _hover={{bg:'button.danger'}}
                                onClick={handleRegister}
                                >
                                    Agendar
                                </Button>

                            </Flex>
                </Flex>
            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {

        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/haircuts', {
            params:{
                status: true,
            }
        });

        if(response.data === null){
            return{
                redirect:{
                    destination: '/dashboard',
                    permanent: false
                }
            }
        } 


        return{
            props:{
               haircuts: response.data
            }
        }

    } catch (err) {
        return{
            redirect:{
                destination: '/dashboard',
                permanent: false
            }
        }
    }
})