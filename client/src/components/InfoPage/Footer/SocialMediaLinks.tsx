import { ButtonGroup, ButtonGroupProps, IconButton } from '@chakra-ui/react'
import * as React from 'react'
import { FaInstagram } from 'react-icons/fa'

export const SocialMediaLinks = (props: ButtonGroupProps) => (
  <ButtonGroup variant="ghost" color="gray.600" {...props}>
    <IconButton
      as="a"
      href="http://instagram.com/tangobox.app"
      target="_blank"
      aria-label="Instagram"
      icon={<FaInstagram fontSize="20px" />}
    />
  </ButtonGroup>
)
