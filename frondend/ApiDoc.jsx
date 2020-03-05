import React from 'react'
import SwaggerUIReact from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import swaggerApiSpec from './swaggerApiSpec.json'

import './apiDoc.less'

function ApiDoc (props) {
  return (
    <div className='ApiDoc-wrapper'>
      <SwaggerUIReact docExpansion='list' spec={swaggerApiSpec} />
    </div>
  )
}

ApiDoc.propTypes = {
}

export default ApiDoc
