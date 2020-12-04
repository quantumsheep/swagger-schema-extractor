#!/usr/bin/env node

const axios = require('axios');

function get_type(property) {
  if (property.$ref) {
    return property.$ref.split('/').slice(-1)[0];
  } else if (property.anyOf) {
    return property.anyOf.map(sub => get_type(sub)).join(' | ');
  } else if (property.type === 'array') {
    if (Array.isArray(property.items)) {
      return `[${property.items.map(item => get_type(item)).join(', ')}]`
    }

    return `${get_type(property.items)}[]`
  } else if (property.type === 'integer') {
    return 'number';
  }

  return property.type;
}

/**
 * @param {string} type 
 * @param {string} value 
 */
function convert_value(type, value) {
  if (type === 'string') {
    return `'${value}'`;
  } else if (Array.isArray(value)) {
    return '[]';
  }

  return value;
}

async function main() {
  const [url] = process.argv.slice(2);

  const { data } = await axios(url);

  const schemas = Object.keys(data.components.schemas).map(key => {
    const schema = data.components.schemas[key];

    console.log(schema)

    if (schema.type === 'object') {
      let str = `class ${key} {\n`;

      const properties = Object.keys(schema.properties).map(key => {
        const property = schema.properties[key];

        const type = get_type(property);

        const default_value = property.default !== undefined ? ` = ${convert_value(property.type, property.default)}` : '';
        const optional = schema.required && schema.required.includes(key) ? '' : '?';

        return `  ${key}${optional}: ${type}${default_value};`;
      });

      str += properties.join('\n');
      str += '\n}\n';

      return str;
    } else if (schema.enum) {
      const type = get_type(schema);
      const values = schema.enum.map(value => convert_value(type, value));

      let str = `type ${key} = ${values.join(' | ')};\n`;
      return str;
    }
  });

  console.log(schemas.join('\n'));
}

main();
