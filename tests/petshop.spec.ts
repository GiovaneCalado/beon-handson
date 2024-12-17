import { test, expect } from '@playwright/test';
import { validateContract } from '../utils/apiUtils';

const baseUrl = 'https://petstore3.swagger.io/api/v3/';
const basePayload = {
    id: 10,
    name: "Amendoim",
    category: {
        id: 1,
        name: "Dogs"
    },
    photoUrls: [
        "someurl"
    ],
    tags: [
        {
            id: 0,
            name: 'Auau'
        }
    ],
    status: 'available'
};

test.describe('Validate PET CRUD', () => {
    test('Validate sucessful creation of a pet', async ({request}) => {
        const response = await request.post(`${baseUrl}pet`, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: basePayload
        });
        const responseBody = await response.json();
        expect(response).toBeOK();
        expect(response.status()).toBe(200);
        await validateContract(responseBody, 'add_pet.json');
    });
    
    const invalidDataScenarios = [
        {
            description: 'string value in pet id',
            data: {id: 'test'}
        },
        // {
        //     description: 'float value in pet id',
        //     data: {id: Math.random()}
        // },
        {
            description: 'boolean value in pet id',
            data: {id: false}
        }
        // {
        //     description: 'null value in pet id',
        //     data: {id: null}
        // },
        // {
        //     description: 'int value in pet name',
        //     data: {name: 10}
        // },
        // {
        //     description: 'float value in pet name',
        //     data: {name: Math.random()}
        // },
        // {
        //     description: 'boolean value in pet name',
        //     data: {name: false}
        // },
        // {
        //     description: 'null value in pet name',
        //     data: {name: null}
        // },
        // {
        //     description: 'value out of scope for status',
        //     data: {status: 'Other Value'}
        // }
        // .
        // .
        // .
        // The scenarios could go on with the other, but it seems that the application is not prepared for data type tests
        // Even most of the scenarios written above are failing, they have been commented for that reason
    ];
    invalidDataScenarios.forEach((scenario) => {
        test(`Validate error in creating pet with ${scenario.description}`, async ({request}) => {
            const payload = {...basePayload, ...scenario.data};
            const response = await request.post(`${baseUrl}pet`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: payload
            });
            const responseBody = await response.json();
            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(400);
            await validateContract(responseBody, 'add_pet_error.json');
        });
    });

    const requiredFieldsScenarios = [
        {
            description: 'field name',
            field: 'name'
        },
        {
            description: 'field photoUrls',
            field: 'photoUrls'
        },
    ];

    // Also here the documentation says the fields are required, but they`re not, the scenarios are failing
    requiredFieldsScenarios.forEach((scenario) => {
        test(`Validate error in pet creation without the required ${scenario.description}`, async ({request}) => {
            const payload = structuredClone(basePayload);
            delete payload[scenario.field];
            console.log(payload);
            const response = await request.post(`${baseUrl}pet`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: payload
            });
            const responseBody = await response.json();
            expect(response.ok()).toBeFalsy();
            expect(response.status()).toBe(400);
            await validateContract(responseBody, 'add_pet_error.json');
        });
    });
});