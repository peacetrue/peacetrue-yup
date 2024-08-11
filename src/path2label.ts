import {AnySchema, ValidationError} from 'yup';
import {addGlobalErrorHandlers} from "./globalErrorHandlers";

// concat -> prepend

// 将 message 中嵌套的 path 转换为 label，例如：persons[0].name -> 人物 0 的名称
export function labelMessages(error: ValidationError, schema: AnySchema) {
  error.errors = new Array(error.inner.length);
  error.inner.forEach((inner, index) => {
    labelMessage(inner, schema);
    error.errors[index] = inner.message;
  });
}

export function labelMessage(error: ValidationError, schema: AnySchema) {
  const path = error.params?.label || error.path;
  if (typeof path === 'string') {
    const label = resolveLabel(error.path!, schema);
    error.message = error.message.replace(path, label);
  }
}

export function resolveLabel(path: string, schema: AnySchema) {
  const segments = resolvePath(path);
  return getLabel(segments, schema);
}

export interface PathSegment {
  type: 'prop' | 'index';
  value: string | number;
}

function resolvePath(path: string): PathSegment[] {
  const regex = /(\w+)|\[(\d+)]/g;
  const segments: PathSegment[] = [];
  let match;
  while ((match = regex.exec(path)) !== null) {
    if (match[1]) {
      segments.push({value: match[1], type: 'prop'});
    } else if (match[2]) {
      segments.push({value: Number(match[2]), type: 'index'});
    }
  }

  return segments;
}

/**
 *
 * @param segments
 * @param schema
 * @param indexRowDiff 索引和行号的间隔
 * @return {string}
 */
function getLabel(
  segments: PathSegment[],
  schema: AnySchema,
  indexRowDiff: number = 2
): string {
  let currentSchema: any = schema;
  return segments
    .map(segment => {
      if (typeof segment.value === 'string') {
        currentSchema = currentSchema.fields[segment.value];
        return currentSchema?.describe()?.label || segment.value;
      } else {
        if (currentSchema.innerType) {
          currentSchema = currentSchema.innerType;
        }
        return `[${segment.value + indexRowDiff}]`;
      }
    })
    .join('');
}

export function addNestedLabelErrorHandler() {
  addGlobalErrorHandlers(labelMessages);
}
