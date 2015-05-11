define(
    [],
    function () {
        return {
            /**
             * Normalize value of entity's field. Set one item of list by field's property or simple value
             * Example:                 if valuesList is defined:                   if valuesList is NOT defined:
             * entity = {
             *     type: {              valuesList = [                              Result: entity.type === 1
             *         id: 1                { id: 1},
             *     }                        { id: 2},
             * }                            { id: 3}
             * field = 'type'           ]
             * fieldProperty = 'id'    Result: entity.type === valuesList[0]
             *
             * @param {Object} entity
             * @param {string} field
             * @param {string} fieldProperty
             * @param {Object[]} valuesList
             *
             * @returns void
             */
            normalizeEntityField: function (entity, field, fieldProperty, valuesList) {
                var currentValue,
                    findCondition = {};

                currentValue = _.isObject(entity[field])
                    ? entity[field][fieldProperty]
                    : entity[field];
                findCondition[fieldProperty] = currentValue;

                if (valuesList) {
                    entity[field] = _.findWhere(valuesList, findCondition);
                }

                entity[field] = entity[field] ? entity[field] : currentValue;
            }
        }
    }
);
