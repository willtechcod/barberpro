import { useState } from 'react';
import Head from "next/head";
import { 
    Flex, 
    Text,
    Heading,
    Button,
    Link as ChakraLink,
    useMediaQuery,
    useDisclosure
} from '@chakra-ui/react';

import Link from "next/link";
import { IoMdPerson } from 'react-icons/io'

import { canSSRAuth } from '../../utils/canSSRAuth';
import {Sidebar} from '../../components/sidebar';
import {setupAPIClient} from '../../services/api';
import { ModalInfo } from '../../components/modal';


export interface ScheduleItem{
    id: string;
    customer: string;
    haircut:{
        id: string;
        name: string;
        price: string | number;
        user_id: string;
    }
}


interface DashboardProps{
    schedule: ScheduleItem[]
}

export default function Dashboard({schedule}: DashboardProps){

    const [service, setService] = useState<ScheduleItem>();
    const [isMobile] = useMediaQuery("(max-width: 500px)");
    const  { isOpen, onOpen, onClose } = useDisclosure();
    const [list, setList] = useState(schedule);

    function handleOpenModal(item: ScheduleItem){
        setService(item);
        onOpen();
    }

    async function handleFinish(id: string){
        try {
            const apiClient = setupAPIClient();
            await apiClient.delete('/schedule', {
                params:{
                   schedule_id:  id
                }
            });

            const filterItem = list.filter(item => {
                return (item?.id !== id)
            });
            
            setList(filterItem);
            onClose();

        } catch (err) {
            alert("Erro ao finalizar este serviço! "+err);
            onClose();
        }
    }

    return(
            <>
            <Head>
                <title>BarberPró  -  Minha barbearia</title>
            </Head>
                <Sidebar>
                    <Flex direction="column" align="flex-start" justify="flex-start">
                        <Flex w="100%" direction="row" align="center" justify="flex-start">
                            <Heading color="red.900" fontSize="2xl" mt={4} mb={4} mr={4}>
                                Agenda
                            </Heading>
                            <Link href="/new">
                                    <Button
                                    bg="gray.700"
                                    _hover={{bg: "gray.600"}}
                                    color="white"
                                    >
                                        Registrar
                                    </Button>
                            </Link>
                        </Flex>

                            {list.map(item => (
                                <ChakraLink
                                onClick={() => handleOpenModal(item)}
                                key={item?.id}
                                w="100%"
                                m={0}
                                p={0}
                                mt={1}
                                background="transparent"
                                style={{textDecoration: 'none'}}
                                >
                                    
                                    <Flex 
                                    w="100%"
                                    direction={isMobile ? "column" : "row"}
                                    p={4}
                                    rounded={4}
                                    mb={1}
                                    bg="barber.400"
                                    justify="space-between"
                                    align={isMobile ? "flex-start" : "center"}
                                    >
                                        <Flex direction="row" mb={isMobile ? 2 : 0} align="center" justify="center">
                                            <IoMdPerson size={24} color="#fba931"/>
                                            <Text
                                            fontWeight="bold"
                                            color="white"
                                            noOfLines={2}
                                            ml={4}
                                            >
                                               {item?.customer}
                                            </Text>
                                        </Flex>
                                            <Text fontWeight="bold" mb={isMobile ? 2 : 0} color="gray.400">
                                                {item?.haircut?.name}
                                            </Text>
                                            <Text fontWeight="bold" mb={isMobile ? 2 : 0} color="gray.400">
                                                R$ {item?.haircut?.price}
                                            </Text>
                                    </Flex>
                                </ChakraLink>
                            ))}
                        
                    </Flex>
                </Sidebar>
                <ModalInfo
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                data={service}
                finishService={()=> handleFinish(service?.id)}
                 />
            </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/schedule');

        

        return{
            props:{
                schedule: response.data,
            }
        }

    } catch (err) {
        console.log(err);
        return{
            props:{
                schedule: []
            }
        }
    }

})
