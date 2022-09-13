import {
    Modal,
    ModalHeader,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Button,
    Flex
} from '@chakra-ui/react';

import { FiUser, FiScissors } from 'react-icons/fi';
import { FaMoneyBillAlt } from 'react-icons/fa';

import { ScheduleItem } from './../../pages/dashboard/index';

interface ModalInfoProps{
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    data: ScheduleItem;
    finishService: () => Promise<void>;
}

export function ModalInfo({ isOpen, onClose, onOpen, data, finishService }: ModalInfoProps){
    return(
        <Modal isOpen={isOpen} onClose={onClose} >
          <ModalOverlay/>
          <ModalContent bg="barber.400">
            <ModalHeader>Próximo</ModalHeader>
            <ModalCloseButton color="button.cta"/>

            <ModalBody color="white">
                <Flex align="center" mb={3}>
                    <FiUser size={28} color="#ffba3e"/>
                    <Text ml={3} fontSize="large" fontWeight="bold" color="#FFF">
                        {data?.customer}
                    </Text>
                </Flex>

                <Flex align="center" mb={3}>
                    <FiScissors size={28} color="#7cd6e6"/>
                    <Text ml={3} fontSize="md" fontWeight="bold" color="#FFF">
                        {data?.haircut?.name}
                    </Text>
                </Flex>

                <Flex align="center" mb={3}>
                    <FaMoneyBillAlt size={28} color="#46ef75"/>
                    <Text ml={3} fontSize="md" fontWeight="bold" color="#FFF">
                        R$ {data?.haircut?.price}
                    </Text>
                </Flex>

                <ModalFooter>
                    <Button 
                    bg="button.cta"
                     _hover={{bg:'button.danger'}} 
                     color="#fff"
                     onClick={()=> finishService()}
                      >
                        Finalizar Serviço
                    </Button>
                </ModalFooter>
                
            </ModalBody>

          </ModalContent>
        </Modal>
    )
}