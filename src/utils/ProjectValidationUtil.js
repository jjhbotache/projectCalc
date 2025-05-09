import { initialState } from '../slices/projectSlice';

/**
 * Genera un esquema de validación dinámicamente a partir de un objeto
 * @param {Object} obj - El objeto del cual generar el esquema
 * @param {boolean} isRoot - Indica si es el objeto raíz
 * @returns {Object} - El esquema de validación
 */
const generateSchemaFromObject = (obj, isRoot = false) => {
  // Si es null o undefined, no podemos generar un esquema
  if (obj === null || obj === undefined) {
    return { type: 'null' };
  }

  // Si es un array
  if (Array.isArray(obj)) {
    // Si el array está vacío, no podemos determinar el tipo de sus elementos
    if (obj.length === 0) {
      return { 
        type: 'array',
        items: {}
      };
    }
    
    // Generamos el esquema para el primer elemento como referencia
    const firstItemSchema = generateSchemaFromObject(obj[0]);
    
    return {
      type: 'array',
      items: firstItemSchema
    };
  }

  // Si es un objeto
  if (typeof obj === 'object') {
    const properties = {};
    const required = [];

    // Procesamos cada propiedad del objeto
    for (const [key, value] of Object.entries(obj)) {
      properties[key] = generateSchemaFromObject(value);
      required.push(key); // Consideramos todas las propiedades como requeridas
    }

    return {
      type: 'object',
      properties,
      required
    };
  }

  // Para tipos primitivos, simplemente devolvemos su tipo
  return { type: typeof obj };
};

// Genera el esquema dinámicamente a partir de initialState
export const ProjectSchema = generateSchemaFromObject(initialState, true);

/**
 * Checks if a value matches the expected type
 * @param {any} value - The value to check
 * @param {string} expectedType - The expected type
 * @returns {boolean} - Whether the value matches the expected type
 */
const checkType = (value, expectedType) => {
  if (expectedType === 'array') {
    return Array.isArray(value);
  }
  return typeof value === expectedType;
};

/**
 * Validate an object against a schema
 * @param {Object} data - The data to validate
 * @param {Object} schema - The schema to validate against
 * @param {string} path - Current path in the object (for error messages)
 * @returns {Object} - Validation result { valid: boolean, errors: string[] }
 */
const validateAgainstSchema = (data, schema, path = '') => {
  const errors = [];

  // Check type
  if (schema.type && !checkType(data, schema.type)) {
    errors.push(`${path || 'Value'} should be of type ${schema.type}, but got ${Array.isArray(data) ? 'array' : typeof data}`);
    return { valid: false, errors };
  }

  // For arrays, validate each item if schema.items is defined
  if (schema.type === 'array' && schema.items && Array.isArray(data)) {
    data.forEach((item, index) => {
      const itemPath = `${path}[${index}]`;
      const itemResult = validateAgainstSchema(item, schema.items, itemPath);
      if (!itemResult.valid) {
        errors.push(...itemResult.errors);
      }
    });
  }

  // For objects, validate properties
  if (schema.type === 'object' && schema.properties && typeof data === 'object' && data !== null) {
    // Check required properties
    if (schema.required) {
      for (const requiredProp of schema.required) {
        if (!(requiredProp in data)) {
          errors.push(`${path ? path + ' ' : ''}missing required property: ${requiredProp}`);
        }
      }
    }

    // Check for extra properties
    const allowedProps = Object.keys(schema.properties);
    const actualProps = Object.keys(data);
    const extraProps = actualProps.filter(prop => !allowedProps.includes(prop));
    
    if (extraProps.length > 0) {
      errors.push(`${path ? path + ' ' : ''}contains extra properties: ${extraProps.join(', ')}`);
    }

    // Validate each property
    for (const [prop, propSchema] of Object.entries(schema.properties)) {
      if (prop in data) {
        const propPath = path ? `${path}.${prop}` : prop;
        const propResult = validateAgainstSchema(data[prop], propSchema, propPath);
        if (!propResult.valid) {
          errors.push(...propResult.errors);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
};




// Export a standalone validation function for use outside of React components
export const validateProjectData = (projectData) => {
  return validateAgainstSchema(projectData, ProjectSchema);
};