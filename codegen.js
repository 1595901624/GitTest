const fs = require('fs');
const path = require('path');

// demo 
const fileContent = `
    type Event = Readonly<{
        index: Int32;//5
    }>;
    export interface NativeProps extends ViewProps {
    title?: string;//选择有效次数
    countList?: string;//1,2,3,4,5,6,7,8,9,10
    countUnit?: string;//次
    currentIndex?: Int32;//5
    // 5
    onCancel?: DirectEventHandler<Event>;
    onSure?: DirectEventHandler<Event>;
    }

    export default codegenNativeComponent<NativeProps>(
        'RTNCountSelection'
    ) as HostComponent<NativeProps>;
`;

// 定义正则表达式模式
// const componentNameRegex = /'([^']+)'/;
// const propsRegex = /NativeProps[\s\S]*?{/;
const eventRegex = /on[A-Z][a-zA-Z]*: DirectEventHandler<Event>;/

const componentRegex = /codegenNativeComponent<(.*)>\(\s*['"`]([^']+)['"`]\s*\)\s+as\s+HostComponent<.*>/;

// 匹配注释
const commentRegex = /\/\/.*/g;
// 匹配属性类名称
const propsNameRegex = /codegenNativeComponent<(.*)>/;
// 匹配属性
const propsRegex = /extends ViewProps {((.*\n\s*)*)}/;

function initParams() {
    const newFileContent = fileContent.replace(commentRegex, '');
    console.log(newFileContent);

    const component = newFileContent.match(componentRegex);
    const propClazz = component && component[1] ? component[1] : null;
    const componentClazz = component && component[2] ? component[2] : null;
    console.log(propClazz);
    console.log(componentClazz);

    if (propClazz == null) {
        console.log("No NativeProps Defined!");
        return;
    }

    if (componentClazz == null) {
        console.log("No component Defined!");
        return;
    }

    // 获取 view props 
    const propsAndEventsResult = newFileContent.match(propsRegex);
    const propsAndEvents = propsAndEventsResult && propsAndEventsResult[1] ? propsAndEventsResult[1] : null;
    console.log(propsAndEvents);

    if (propsAndEvents == null) {
        console.log("No PropsAndEvents Defined!");
        return;
    }
}

function generateCode() {
    // ${PROJECT_NAME}
    // ${COPONENT_NAME}
    processProjectComponentName();
}

/**
 * 步骤 一：处理所有的项目名称和组件名称
 */
function processProjectComponentName() {
    // 1. 复制 template 目录到 PROJECT_NAME 目录
    const templateDir = path.join(__dirname, "template");
    copyFolderSync(templateDir, PROJECT_NAME);
}

function main() {
    // initParams();
    generateCode();
}


function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }

    const files = fs.readdirSync(source);

    files.forEach((file) => {
        const currentPath = path.join(source, file);
        const targetPath = path.join(target, file);

        if (fs.lstatSync(currentPath).isDirectory()) {
            copyFolderSync(currentPath, targetPath);
        } else {
            fs.copyFileSync(currentPath, targetPath);
        }
    });
}

const PROJECT_NAME = "test"
const COPONENT_NAME = "RTNTest"
main();