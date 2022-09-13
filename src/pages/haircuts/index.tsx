import { useState, ChangeEvent } from "react";
import Head from "next/head";
import { Sidebar } from "../../components/sidebar";
import {
    Flex,
    Text,
    Heading,
    Button,
    Stack,
    Switch,
    useMediaQuery
} from '@chakra-ui/react';

import Link from "next/link";

import {IoMdPricetag} from 'react-icons/io';
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";

interface HaircutsItem{
    id: string;
    name: string;
    price: number | string;
    status: boolean;
    user_id: string;   
}

interface HaircutsProps{
   haircuts: HaircutsItem[];
}

export default function Haircuts({haircuts}: HaircutsProps){

   const [isMobile] = useMediaQuery("(max-width: 500px)");

   const [haircutList, setHaircutList] = useState<HaircutsItem[]>(haircuts || []);
   const [disableHaircut, setDisableHaircut] = useState("enabled");

   async function handleDisable(e: ChangeEvent<HTMLInputElement>){
    const apiClient = setupAPIClient();


        if(e.target.value === 'disabled'){

            setDisableHaircut("enabled");

            const response = await apiClient.get('/haircuts', {
                params:{
                   status: true 
                }
            })

            setHaircutList(response.data);

        }else{

            setDisableHaircut("disabled");
            
            const response = await apiClient.get('/haircuts', {
                params:{
                   status: false
                }
            })
            
            setHaircutList(response.data);

        }
   }

    return(
        <>
            <Head>
                <title>Serviços e corte - Minha barbearia</title>
            </Head>
            <Sidebar>
                <Flex 
                direction="column"
                alignItems="flex-start"
                justifyContent="flex-start"
                >
                    <Flex
                    direction={isMobile ?  'column' : 'row'}
                    w="100%"
                    alignItems={isMobile ?  'flex-start' : 'center'}
                    justifyContent="flex-start"
                    mb={0}
                    >
                        <Heading
                        fontSize={isMobile ?  '22px' : '2xl'}
                        mt={4}
                        mb={4}
                        mr={4}
                        color="red.900"
                        >
                           Serviços e Cortes 
                        </Heading>
                        <Link href="/haircuts/new">
                            <Button 
                            bg="gray.700"
                            _hover={{bg: "gray.600"}}
                            color="white"
                            >
                                Cadastrar novo
                            </Button>
                        </Link>

                        <Stack ml="auto" align="center" direction="row">
                            <Text color="white" fontSize={16} fontWeight="bold">ATIVOS</Text>
                            <Switch 
                            colorScheme="green"
                            size="sm"
                            value={disableHaircut}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleDisable(e)}
                            isChecked={disableHaircut === 'disabled' ? false : true}
                            />
                        </Stack>

                    </Flex>

                    {haircutList.map(haircut => (
                        <Link key={haircut.id} href={`/haircuts/${haircut.id}`}>
                        <Flex
                        cursor="pointer"
                        w="100%"
                        p={4}
                        bg="barber.400"
                        direction={isMobile ? "column" : "row"}
                        alignItems={isMobile ? "flex-start" : "center"}
                        rounded={4}
                        mb={2}
                        mt={4}
                        justifyContent="space-between"
                        >
                            <Flex mb={isMobile ? 2 : 0} direction="row" alignItems="center" justifyContent="center">
                                <IoMdPricetag size={24} color="#fba931" />
                                <Text fontWeight="bold" noOfLines={2} ml={4} color="white">
                                    {haircut.name}
                                </Text>
                            </Flex>

                            <Text fontWeight="bold" color="white">
                                Preço: R$ {haircut.price}
                            </Text>

                        </Flex>
                    </Link>
                    ))}

                </Flex>
            </Sidebar>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {

        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/haircuts', 

        {
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
            props: {
               haircuts: response.data 
            }
        }
        
    } catch (err) {
        alert(err);
        return{
            redirect:{
                destination: '/dashboard',
                permanent: false
            }
        }
    }
})
