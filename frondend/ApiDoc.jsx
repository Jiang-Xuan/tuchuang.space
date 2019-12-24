import React from 'react'
import SwaggerUIReact from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import swaggerApiSpec from './swaggerApiSpec.json'

function ApiDoc (props) {
  return (
    <div>
      <SwaggerUIReact spec={swaggerApiSpec} />
    </div>
  )
}

ApiDoc.propTypes = {
}

export default ApiDoc
